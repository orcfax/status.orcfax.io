import PocketBase from 'pocketbase';
import {
	ITNSnapshotRecordSchema,
	LicenseHolderRecordWithSnapshotsSchema,
	ValidatorLicenseRecordSchema,
	type ITNSnapshotRecord,
	type LicenseHolderRecord,
	type LicenseHolderRecordWithSnapshots,
	type LicenseHolderSummary,
	type ValidatorLicenseRecord,
	type ValidatorSummary
} from '$lib/types';
import { z } from 'zod';
import { formatPercentageValue } from '$lib/client/helpers';

export async function load({ locals }) {
	return await getValidatorSummary(locals.pb);
}

async function getValidatorSummary(pb: PocketBase): Promise<ValidatorSummary> {
	const licenseHolders = await getLicenseHoldersWithSnapshots(pb);
	const licenses = await getValidatorLicenses(pb);

	const licenseHolderSummaries: LicenseHolderSummary[] = [];
	licenseHolders.forEach((holder) => {
		const licensesHeld = licenses
			.filter((license) => license.holder === holder.id)
			.sort((a, b) => a.licenseNumber - b.licenseNumber);

		const licenseMult = holder.hasLicenseMult ? 0.05 : 0;
		const minFACTMult = holder.hasMinFACTMult ? 0.1 : 0;
		const averageFACTMult = holder.averageFACTMult ?? 0;
		const totalITNMultiplier = licenseMult + minFACTMult + averageFACTMult;

		licenseHolderSummaries.push({
			...holder,
			licensesHeld,
			isNFTExchange: licensesHeld.some((license) => license.isForSale),
			totalITNMultiplier
		});
	});

	licenseHolderSummaries.sort((a, b) => {
		const aTotal = parseFloat(formatPercentageValue(a.totalITNMultiplier));
		const bTotal = parseFloat(formatPercentageValue(b.totalITNMultiplier));
		if (aTotal === bTotal) {
			// If num1 is equal, sort by total ITN multiplier
			return b.averageFACTHoldings - a.averageFACTHoldings;
		}
		// Otherwise, sort by num1
		return bTotal - aTotal;
	});

	return {
		licenseHolders: licenseHolderSummaries,
		licensesHeldCount: licenses.filter((license) => license.isForSale === false).length,
		licensesForSaleCount: licenses.filter((license) => license.isForSale === true).length
	};
}

async function getLicenseHoldersWithSnapshots(
	pb: PocketBase
): Promise<LicenseHolderRecordWithSnapshots[]> {
	try {
		const records = await pb.collection('license_holders').getFullList<LicenseHolderRecord>();

		// Get snapshots for each holder
		const holderSnapshotResponses: { holderID: string; snapshots: ITNSnapshotRecord[] }[] = [];
		for (const holder of records) {
			holderSnapshotResponses.push(await getITNSnapshotsByHolderID(pb, holder.id));
		}

		// Combine holder records with snapshots
		const holdersWithSnapshots = records.map((holder) => {
			const snapshotsForHolder =
				holderSnapshotResponses.find((response) => response.holderID === holder.id)?.snapshots ??
				[];
			return { ...holder, snapshots: snapshotsForHolder };
		});

		const parsedHolders = z
			.array(LicenseHolderRecordWithSnapshotsSchema)
			.parse(holdersWithSnapshots);

		return parsedHolders;
	} catch (error) {
		console.error(`Error retrieving license holder records: ${error}`);
		return [];
	}
}

async function getValidatorLicenses(pb: PocketBase): Promise<ValidatorLicenseRecord[]> {
	try {
		const records = await pb
			.collection<ValidatorLicenseRecord>('validator_licenses')
			.getFullList({ expand: 'holder' });
		const parsedLicenses = z.array(ValidatorLicenseRecordSchema).parse(records);

		return parsedLicenses;
	} catch (error) {
		console.error(`Error retrieving Validator License records: ${error}`);
		return [];
	}
}

async function getITNSnapshotsByHolderID(
	pb: PocketBase,
	holderID: string
): Promise<{ holderID: string; snapshots: ITNSnapshotRecord[] }> {
	try {
		const records = await pb.collection<ITNSnapshotRecord>('itn_snapshots').getFullList({
			filter: `wallet="${holderID}"`
		});
		const parsedRecords = z.array(ITNSnapshotRecordSchema).parse(records);

		return { holderID, snapshots: parsedRecords };
	} catch (error) {
		console.error(`Error retrieving ITN snapshots by holder ID: ${error}`);
		return { holderID, snapshots: [] };
	}
}
