import getConfig from 'services/config';
import { createContract } from 'services/helpers';
import ApiService from 'services/helpers/apiService';
import {
  INFTMetadata,
  INFTTokenMetadata,
  NonFungibleTokenContractInterface,
} from 'services/interfaces';

import { nftChangeMethods, nftViewMethods } from './contractMethods';

const ICON_DEFAULT_VALUE = '';

const defaultContractMetadata = {
  spec: '',
  name: '',
  symbol: '',
  icon: ICON_DEFAULT_VALUE,
  base_uri: '',
  reference: '',
  reference_hash: '',
  copies: 1,
};

export default class NonFungibleTokenContract {
  constructor(props: NonFungibleTokenContractInterface) {
    this.contract = createContract(
      props.wallet,
      props.contractId,
      nftViewMethods,
      nftChangeMethods,
    );
    this.contractId = props.contractId;
  }

  config = getConfig();

  contract: any;

  contractId;

  contractMetadata: INFTMetadata = defaultContractMetadata;

  tokenMetadata: { [key: string]: INFTTokenMetadata } = {};

  static buildMediaUrl = (media: string, base_uri: string | null | undefined) => {
    if (!media || media.includes('://') || media.startsWith('data:image')) {
      return media;
    }

    if (base_uri) {
      return `${base_uri}/${media}`;
    }

    return `https://cloudflare-ipfs.com/ipfs/${media}`;
  };

  async getNFTContractMetadata(): Promise<INFTMetadata | null> {
    try {
      const contractMetadata = await this.contract.nft_metadata();
      this.contractMetadata = { ...contractMetadata };
      return contractMetadata;
    } catch (e) {
      console.warn(`Error while loading ${this.contractId}`);
    }
    return null;
  }

  async getNFTTokenMetadata(
    tokenId: string,
    base_uri: string | null | undefined,
  ): Promise<{ [key: string]: INFTTokenMetadata } | null> {
    try {
      if (!this.tokenMetadata) return this.tokenMetadata;

      const tokenMetadata = await this.contract.nft_token({ token_id: tokenId });
      const { media, reference } = tokenMetadata.metadata;

      if (this.contractId === this.config.parasContractId) {
        const parasMetadata = await ApiService.getNftParasMetadata(this.contractId, tokenId);
        if (parasMetadata) tokenMetadata.metadata = parasMetadata;
      } else if (!media && reference && base_uri) {
        const data = await fetch(`${base_uri}/${reference}`);
        tokenMetadata.metadata = await data.json();
      }

      tokenMetadata.metadata.media = NonFungibleTokenContract.buildMediaUrl(tokenMetadata.metadata.media, base_uri);

      this.tokenMetadata = {
        ...this.tokenMetadata,
        [tokenId]: {
          ...tokenMetadata,
        },
      };
      return tokenMetadata;
    } catch (e) {
      console.warn(`Error while loading ${this.contractId}`);
    }
    return null;
  }
}
