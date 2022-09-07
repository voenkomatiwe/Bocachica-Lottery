import { EImage } from 'shared/interfaces';

const getUrlExtension = (url: string): string | undefined => url.split(/[#?]/)[0].split('.').pop();
const regexImageType = /jpeg|jpg|gif|png|svg/;

const getImageFileExtensions = (media?: string, blobType?: string, mimeType?: string) => {
  const type = media ? getUrlExtension(media) : '';
  const match = (mimeType || blobType || type || '').match(regexImageType);
  if (match) return match[0].toUpperCase();
  return EImage.JPG;
};

export default getImageFileExtensions;
