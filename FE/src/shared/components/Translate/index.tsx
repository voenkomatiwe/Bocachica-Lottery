import { useTranslation } from 'react-i18next';

import { ITranslationKeys } from 'services/translation';

const Translate: React.FC<{ value: ITranslationKeys, dynamicValue?: string }> = ({ value, dynamicValue }) => {
  const [t] = useTranslation();
  return t(value, { dynamicValue });
};
export default Translate;
