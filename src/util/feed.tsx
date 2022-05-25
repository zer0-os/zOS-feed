import { metadataService } from '@zer0-os/zos-zns';

export const fetchMetadata = async (metadataUrl, metadataService, abortController) => {
  try {
    const response = await fetch(metadataUrl, { signal: abortController.signal });
    return metadataService.normalize(await response.json());
  } catch (e) {
    console.log('error', e);
  }
}
