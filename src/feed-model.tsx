export interface Model {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  znsRoute: string;
  metadataUrl: string;
  owner?: string;
  minter?: string;
  attributes?: [any];
  animationUrl?: string;
  ipfsContentId: string;
}
