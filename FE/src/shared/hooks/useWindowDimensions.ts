import { useState, useEffect } from 'react';

import { EDimensions, MEDIA_WIDTHS } from 'shared/constant';

function getWindowDimensions() {
  const { innerWidth: width } = window;
  if (width >= MEDIA_WIDTHS.upToLarge) return EDimensions.EXTRA_LARGE;
  if (width >= MEDIA_WIDTHS.upToMedium && width < MEDIA_WIDTHS.upToLarge) return EDimensions.LARGE;
  if (width >= MEDIA_WIDTHS.upToSmall && width < MEDIA_WIDTHS.upToMedium) return EDimensions.MEDIUM;
  if (width < MEDIA_WIDTHS.upToSmall) return EDimensions.SMALL;
  return EDimensions.UNKNOWN;
}

const useWindowDimensions = () => {
  const [windowDimension, setWindowDimension] = useState<EDimensions>(EDimensions.LARGE);

  useEffect(() => {
    function handleResize() {
      const dimension = getWindowDimensions();
      if (dimension !== windowDimension) setWindowDimension(dimension);
    }

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  return windowDimension;
};

export default useWindowDimensions;
