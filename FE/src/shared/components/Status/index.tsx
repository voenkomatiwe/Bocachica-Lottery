import Translate from 'shared/components/Translate';
import { EStatus, StatusLocales } from 'shared/utils/statusLocales';

import styles from './styles';

export default function Status({ type }: { type: EStatus }): JSX.Element {
  return (
    <styles.StatusWrapper type={type}>
      <styles.StatusText>
        <Translate value={StatusLocales[type]} />
      </styles.StatusText>
    </styles.StatusWrapper>
  );
}
