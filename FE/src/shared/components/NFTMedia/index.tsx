import FailedToLoad from 'assets/images/failed-to-load.svg';

import styles from './styles';

interface INFTMedia {
  media: string,
  isLoading: boolean,
}

export default function NFTMedia({ media, isLoading }: INFTMedia) {
  if (isLoading) {
    return (<styles.Loading />);
  }
  return (
    <styles.Image
      src={media}
      alt="NFT"
      onError={(e) => {
        (e.target as HTMLInputElement).onerror = null;
        (e.target as HTMLInputElement).src = FailedToLoad;
      }}
    />
  );
}
