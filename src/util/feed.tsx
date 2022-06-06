import { metadataService as znsMetadataService } from '@zer0-os/zos-zns';

export const fetchMetadata = async (metadataUrl, metadataService = znsMetadataService, _abortController?) => {
  if (!metadataUrl) return;

  try {
    // Consider moving this into MetadataService. The MetadataService is based on SuperAgent which doesn't support the AbortController
    const response = await fetch(metadataUrl);
    return metadataService.normalize(await response.json());
  } catch (_e) {
  }
}

export const augmentWithMetadata = async (item, metadataService, abortController) => {
  const { metadataUrl } = item;

  const metadata = await fetchMetadata(metadataUrl, metadataService, abortController);

  return { ...item, ...metadata };
}

export const isLeafNode = (route, items) => {
  return route.includes('.') && items && items.length === 0
}

export const shorty = (address) => {
  return [address.slice(0, 2), '...', address.slice(-4)].join('');
}