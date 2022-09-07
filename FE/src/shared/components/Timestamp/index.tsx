import { ITranslationKeys } from 'services/translation';
import Translate from 'shared/components/Translate';
import { ITimeLeft } from 'shared/interfaces';

import styles from './styles';

interface ITimestamp {
  title: ITranslationKeys,
  minWidth?: number,
  date: ITimeLeft[],
}

export default function Timestamp({ title, minWidth, date }: ITimestamp): JSX.Element {
  return (
    <styles.Container minWidth={minWidth}>
      <styles.Title>
        <Translate value={title} />
      </styles.Title>
      <styles.TimeBlock>
        {date.map((item) => (
          <styles.Time key={item.id}>
            {item.value}
            <styles.Dots />
          </styles.Time>
        ))}
      </styles.TimeBlock>
    </styles.Container>
  );
}
