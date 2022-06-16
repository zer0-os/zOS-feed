export const isLeafNode = (route, items) => {
  return route.includes('.') && items && items.length === 0
}

export const shorty = (address) => {
  if (!address) return null;

  return [address.slice(0, 2), '...', address.slice(-4)].join('');
};

enum NETWORK_TYPES {
  MAINNET = 'MAINNET',
  RINKEBY = 'RINKEBY',
  ROPSTEN = 'ROPSTEN',
  KOVAN = 'KOVAN',
  LOCAL = 'LOCAL',
}

const getEtherscanUri = (networkType: NETWORK_TYPES): string => {
  let prefix = '';
  switch (networkType) {
    case NETWORK_TYPES.ROPSTEN:
      prefix = 'ropsten.';
      break;
    case NETWORK_TYPES.RINKEBY:
      prefix = 'rinkeby.';
      break;
    case NETWORK_TYPES.KOVAN:
      prefix = 'kovan.';
  }

  return `https://${prefix}etherscan.io/`;
};

const getNetworkType = (chainId: number | undefined): NETWORK_TYPES => {
  switch (chainId) {
    case 1:
      return NETWORK_TYPES.MAINNET;
    case 3:
      return NETWORK_TYPES.ROPSTEN;
    case 4:
      return NETWORK_TYPES.RINKEBY;
    case 42:
      return NETWORK_TYPES.KOVAN;
    default:
      return NETWORK_TYPES.LOCAL;
  }
};

export const etherscanLink = (
  id: string,
  chainId: number,
  znsDomain: string
): string => {
  if (!id || !chainId || !znsDomain) {
    return '';
  }

  const domainIdInteger = BigInt(id);
  const networkType = getNetworkType(chainId);
  const etherscanBaseUri = getEtherscanUri(networkType);
  const registrarAddress = znsDomain ? znsDomain : '';

  return `${etherscanBaseUri}token/${registrarAddress}?a=${domainIdInteger.toString()}`;
};
