import { metadataService } from '@zer0-os/zos-zns';

export const fetchMetadata = async (metadataUrl, metadataService, abortController) => {
  if (!metadataUrl) return;

  try {
    const response = await fetch(metadataUrl, { signal: abortController.signal });
    return metadataService.normalize(await response.json());
  } catch (e) {
    console.log('error', e);
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
