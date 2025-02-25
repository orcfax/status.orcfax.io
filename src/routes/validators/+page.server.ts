import PocketBase from 'pocketbase';
import {
	LicenseHolderRecordWithDataSchema,
	type LicenseHolderRecordWithData,
	type ValidatorSummary
} from '$lib/types';

export async function load({ locals }) {
	return await getValidatorSummary(locals.pb);
}

async function getValidatorSummary(pb: PocketBase): Promise<ValidatorSummary> {
	try {
		const licenseHolders = await getLicenseHolders(pb);
		const allLicenses = licenseHolders.flatMap((holder) => holder.licenses);
		const licensesForSale = allLicenses.filter((license) => license.isForSale);
		const licensesHeld = allLicenses.filter((license) => !license.isForSale);

		// Process license holders and create summaries
		const licenseHolderSummaries = licenseHolders.map((holder) => {
			const licensesHeld = holder.licenses || [];
			licensesHeld.sort((a, b) => a.licenseNumber - b.licenseNumber);

			const licenseMult = holder.hasLicenseMult ? 0.05 : 0;
			const minFACTMult = holder.hasMinFACTMult ? 0.1 : 0;
			const averageFACTMult = holder.averageFACTMult ?? 0;
			const totalITNMultiplier = licenseMult + minFACTMult + averageFACTMult;

			return {
				...holder,
				licensesHeld,
				isNFTExchange: licensesHeld.some((license) => license.isForSale),
				totalITNMultiplier
			};
		});

		// Sort license holders efficiently
		licenseHolderSummaries.sort((a, b) => {
			// First sort by whether they have any licenses at all
			const aHasLicenses = a.licensesHeld.length > 0;
			const bHasLicenses = b.licensesHeld.length > 0;
			if (aHasLicenses !== bHasLicenses) {
				return bHasLicenses ? 1 : -1;
			}

			// Then sort by total ITN multiplier percentage
			const multiplierDiff = b.totalITNMultiplier - a.totalITNMultiplier;
			if (multiplierDiff !== 0) {
				return multiplierDiff;
			}

			// Then sort by average FACT holdings
			if (a.averageFACTHoldings !== b.averageFACTHoldings) {
				return b.averageFACTHoldings - a.averageFACTHoldings;
			}

			// Finally sort by current FACT holdings
			return b.currentFACTHoldings - a.currentFACTHoldings;
		});

		return {
			licenseHolders: licenseHolderSummaries,
			licensesHeldCount: licensesHeld.length,
			licensesForSaleCount: licensesForSale.length
		};
	} catch (error) {
		console.error('Error in getValidatorSummary:', error);
		return {
			licenseHolders: [],
			licensesHeldCount: 0,
			licensesForSaleCount: 0
		};
	}
}

async function getLicenseHolders(pb: PocketBase): Promise<LicenseHolderRecordWithData[]> {
	try {
		const response = await pb.collection('license_holders').getFullList({
			expand: 'itn_snapshots_via_wallet,validator_licenses_via_holder'
		});

		const licenseHolders: LicenseHolderRecordWithData[] = response.map((licenseHolderRecord) => {
			return LicenseHolderRecordWithDataSchema.parse({
				...licenseHolderRecord,
				snapshots: licenseHolderRecord.expand?.itn_snapshots_via_wallet || [],
				licenses: licenseHolderRecord.expand?.validator_licenses_via_holder || []
			});
		});

		return licenseHolders;
	} catch (error) {
		console.error(`Error retrieving license holder records: ${error}`);
		return [];
	}
}

// async function getValidatorLicenses(pb: PocketBase): Promise<ValidatorLicenseRecord[]> {
// 	try {
// 		const records = await pb.collection<ValidatorLicenseRecord>('validator_licenses').getFullList({
// 			expand: 'holder'
// 		});
// 		return z.array(ValidatorLicenseRecordSchema).parse(records);
// 	} catch (error) {
// 		console.error(`Error retrieving Validator License records: ${error}`);
// 		return [];
// 	}
// }

// async function getAllITNSnapshots(pb: PocketBase): Promise<ITNSnapshotRecord[]> {
// 	try {
// 		const records = await pb.collection<ITNSnapshotRecord>('itn_snapshots').getFullList();
// 		return z.array(ITNSnapshotRecordSchema).parse(records);
// 	} catch (error) {
// 		console.error(`Error retrieving ITN snapshots: ${error}`);
// 		return [];
// 	}
// }
