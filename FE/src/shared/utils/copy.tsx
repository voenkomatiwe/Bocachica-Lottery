import { toast, Slide } from 'react-toastify';

import Translate from 'shared/components/Translate';

const copy = async (value: string) => {
  if ('clipboard' in navigator) {
    await navigator.clipboard
      .writeText(value)
      .then(() => {
        toast.success(<Translate value="toast.copy" />, {
          theme: 'colored',
          transition: Slide,
          autoClose: 2000,
        });
      })
      .catch((err) => {
        toast.error(err, {
          theme: 'colored',
          transition: Slide,
        });
      });
  } else {
    toast.error(<Translate value="toast.copyNotAvailable" />, {
      theme: 'colored',
      transition: Slide,
    });
  }
};
export default copy;
