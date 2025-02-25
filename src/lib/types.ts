import { z } from 'zod';

export const LicenseHolderRecordSchema = z.object({
	id: z.string(),
	paymentAddress: z.string(),
	stakeAddress: z.string().nullable(),
	currentFACTHoldings: z.number(),
	averageFACTHoldings: z.number(),
	heldLicenseAtStart: z.boolean().nullable(),
	hasLicenseMult: z.boolean().nullable(),
	hasMinFACTMult: z.boolean().nullable(),
	averageFACTMult: z.number().nullable()
});

export const ValidatorLicenseRecordSchema = z.object({
	id: z.string(),
	licenseNumber: z.number(),
	assetName: z.string(),
	assetFingerprint: z.string(),
	isForSale: z.boolean(),
	holder: z.string()
});

export const ITNSnapshotRecordSchema = z.object({
	id: z.string(),
	wallet: z.union([z.string(), LicenseHolderRecordSchema]),
	snapshotDate: z.coerce.date(),
	currentFACT: z.number()
});

export const LicenseHolderRecordWithDataSchema = LicenseHolderRecordSchema.extend({
	snapshots: z.array(ITNSnapshotRecordSchema),
	licenses: z.array(ValidatorLicenseRecordSchema)
});

export const LicenseHolderSummarySchema = LicenseHolderRecordSchema.extend({
	licensesHeld: z.array(ValidatorLicenseRecordSchema),
	isNFTExchange: z.boolean(),
	totalITNMultiplier: z.number()
});

export type LicenseHolderRecord = z.infer<typeof LicenseHolderRecordSchema>;
export type LicenseHolder = Omit<LicenseHolderRecord, 'id'>;
export type ValidatorLicenseRecord = z.infer<typeof ValidatorLicenseRecordSchema>;
export type ITNSnapshotRecord = z.infer<typeof ITNSnapshotRecordSchema>;
export type ITNSnapshot = Omit<ITNSnapshotRecord, 'id'>;
export type LicenseHolderRecordWithData = z.infer<typeof LicenseHolderRecordWithDataSchema>;
export type LicenseHolderSummary = z.infer<typeof LicenseHolderSummarySchema>;
export interface ValidatorSummary {
	licenseHolders: LicenseHolderSummary[];
	licensesHeldCount: number;
	licensesForSaleCount: number;
}

// RSS Feed Items

export const RSSFeedItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	type: z.enum(['incident_reports', 'network_updates', 'blog_posts']),
	description: z.string(),
	link: z.string().optional(),
	publish_date: z.coerce.date(),
	status: z
		.enum(['under_review', 'identified', 'in_progress', 'mitigated', 'resolved', ''])
		.optional()
});

export type RSSFeedItem = z.infer<typeof RSSFeedItemSchema>;

export const RSSFeedParamsSchema = z.object({
	include: z
		.string()
		.optional()
		.nullable()
		.transform((val) => {
			if (!val) return [];

			const categories = val.split(',').map((c) => c.trim());
			const validCategories = categories.filter((c) => c === 'blog_posts');

			return validCategories;
		})
});

export type RSSFeedParams = z.infer<typeof RSSFeedParamsSchema>;

export const NodeSchema = z.object({
	id: z.string(),
	node_urn: z.string(),
	network: z.string(),
	status: z.enum(['active', 'inactive']),
	type: z.enum(['federated', 'decentralized', 'itn']),
	name: z.string(),
	address_locality: z.string().optional(),
	address_region: z.string().optional(),
	geo_coordinates: z.string().optional()
});

export type Node = z.infer<typeof NodeSchema>;

export const SourceSchema = z.object({
	id: z.string(),
	name: z.string(),
	network: z.string(),
	recipient: z.string(),
	sender: z.string(),
	type: z.enum(['CEX API', 'DEX LP']),
	status: z.enum(['active', 'inactive', '']).transform((val) => val ?? 'inactive'),
	website: z.string(),
	image_path: z.string(),
	background_color: z.string(),
	// For CEX sources, assetPairValue is used. For DEX sources base and quote will be used.
	baseAssetValue: z.number().optional(),
	quoteAssetValue: z.number().optional(),
	assetPairValue: z.number().optional()
});

export type Source = z.infer<typeof SourceSchema>;

export const FeedSchema = z.object({
	id: z.string(),
	network: z.string(),
	feed_id: z.string(),
	type: z.string(),
	name: z.string(),
	version: z.number(),
	status: z.enum(['active', 'inactive']),
	inactive_reason: z.string().optional(),
	source_type: z.enum(['CEX', 'DEX', '']),
	funding_type: z.enum(['showcase', 'paid', 'subsidized', '']),
	calculation_method: z.string(),
	heartbeat_interval: z.number(),
	deviation: z.number(),
	base_asset: z.string().optional(),
	quote_asset: z.string().optional()
});

export type Feed = z.infer<typeof FeedSchema>;

export const OrcfaxStatsSchema = z.object({
	totalFacts: z.number(),
	totalFacts24Hour: z.number(),
	totalActiveFeeds: z.number(),
	sources: z.array(SourceSchema),
	nodes: z.array(NodeSchema)
});

export type OrcfaxStats = z.infer<typeof OrcfaxStatsSchema>;

export const DBFactStatementSchema = z.object({
	id: z.string(),
	network: z.string(),
	policy: z.string(),
	fact_urn: z.string(),
	feed: z.string(),
	value: z.coerce.number(),
	value_inverse: z.coerce.number(),
	validation_date: z.coerce.date(),
	publication_date: z.coerce.date(),
	transaction_id: z.string(),
	storage_urn: z.string(),
	block_hash: z.string(),
	output_index: z.number(),
	address: z.string(),
	slot: z.number(),
	statement_hash: z.string(),
	publication_cost: z.number(),
	participating_nodes: z.union([z.array(z.string()), z.array(NodeSchema)]).catch(() => []),
	storage_cost: z.number(),
	sources: z.union([z.array(z.string()), z.array(SourceSchema)]),
	content_signature: z.string(),
	collection_date: z.coerce
		.date()
		.nullable()
		.catch(() => {
			return null;
		}),
	is_archive_indexed: z.boolean().nullable()
});

export type DBFactStatement = z.infer<typeof DBFactStatementSchema>;

export const DBNetworkSchema = z.object({
	id: z.string(),
	name: z.string(),
	fact_statement_pointer: z.string(),
	script_token: z.string(),
	arweave_wallet_address: z.string(),
	arweave_system_identifier: z.string(),
	cardano_smart_contract_address: z.string(),
	chain_index_base_url: z.string(),
	active_feeds_url: z.string(),
	block_explorer_base_url: z.string(),
	arweave_explorer_base_url: z.string(),
	last_block_hash: z.string(),
	last_checkpoint_slot: z.number(),
	zero_time: z.number(),
	zero_slot: z.number(),
	slot_length: z.number(),
	is_enabled: z.boolean()
});

export type DBNetwork = z.infer<typeof DBNetworkSchema>;

export const PolicySchema = z.object({
	network: z.union([z.string(), DBNetworkSchema]),
	policy_id: z.string(),
	starting_slot: z.number(),
	starting_block_hash: z.string(),
	starting_date: z.coerce.date()
});

export type Policy = z.infer<typeof PolicySchema>;

export const DBPolicySchema = PolicySchema.extend({
	id: z.string()
});

export type DBPolicy = z.infer<typeof DBPolicySchema>;

export const NetworkSchema = DBNetworkSchema.extend({
	policies: z.array(PolicySchema),
	nodes: z.array(NodeSchema),
	sources: z.array(SourceSchema),
	feeds: z.array(FeedSchema)
});

export type Network = z.infer<typeof NetworkSchema>;

export const NetworkWithMetadataSchema = NetworkSchema.extend({
	stats: OrcfaxStatsSchema
});

export type NetworkWithMetadata = z.infer<typeof NetworkWithMetadataSchema>;

export const NodeWithMetadataSchema = NodeSchema.extend({
	totalFacts: z.number(),
	latestFact: DBFactStatementSchema.nullable()
});

export type NodeWithMetadata = z.infer<typeof NodeWithMetadataSchema>;

export const SourceWithMetadataSchema = SourceSchema.extend({
	totalFacts: z.number(),
	latestFact: DBFactStatementSchema.nullable()
});

export type SourceWithMetadata = z.infer<typeof SourceWithMetadataSchema>;
