import getConfig from '../config';

enum RequestTypes {
  GET = 'GET',
}

const HEADERS = { 'Content-type': 'application/json; charset=UTF-8' };

class ApiService {
  config = getConfig();

  async getNftParasMetadata(
    nftTokenContractId: string,
    nftTokenId: string,
  ) {
    const tokenSeriesId = nftTokenId.substring(0, nftTokenId.indexOf(':'));
    const url = `${this.config.parasApiUrl}/token/${nftTokenContractId}::${tokenSeriesId}/${nftTokenId}`;
    try {
      return await fetch(
        url,
        {
          method: RequestTypes.GET,
          headers: HEADERS,
        },
      )
        .then((res) => res.json())
        .then((details) => details.metadata);
    } catch (e) {
      console.warn(`Error ${e} while loading metadata from paras server ${url}`);
      return [];
    }
  }
}

export default new ApiService();
