import { useState, useEffect, useCallback } from 'react';

import { getImageFileExtensions } from 'shared/utils';

const useImageDataUpload = (media?: string, mimeType?: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [blobType, setBlobType] = useState<string | undefined>();

  const typeImage = getImageFileExtensions(media, blobType, mimeType);

  const getMedia = useCallback(async (url: string) => {
    try {
      await fetch(
        url,
        {
          method: 'GET',
          headers: { 'Content-type': 'application/json; charset=UTF-8' },
        },
      )
        .then((res) => res.blob()
          .then((blob) => setBlobType(blob.type)));
    } catch (e) {
      console.warn(`Error ${e} while loading image from ${url}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (media && !mimeType) {
      getMedia(media);
    } else {
      setIsLoading(false);
    }
  }, [media, getMedia, mimeType]);

  return {
    media: media || '',
    isLoading,
    typeImage,
  };
};

export default useImageDataUpload;
