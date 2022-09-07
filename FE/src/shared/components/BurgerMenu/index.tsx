import SocialNetwork from 'shared/components/SocialNetwork';
import Translate from 'shared/components/Translate';
import { colors } from 'shared/theme';
import { burgerMenuList, launchpadsList } from 'shared/utils/burgerMenuLists';
import { socials } from 'shared/utils/socialLinks';

import styles from './styles';

interface IBurgerMenu {
  isOpened: boolean,
}

export default function BurgerMenu({ isOpened }: IBurgerMenu): JSX.Element {
  return (
    <styles.Container isOpen={isOpened}>
      <styles.Column>
        {burgerMenuList.map(({ title, logo: LogoComponent, link }) => (
          <styles.Row
            key={title}
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            <LogoComponent />
            <Translate value={title} />
          </styles.Row>
        ))}
      </styles.Column>
      <styles.Line />
      <styles.Column>
        {launchpadsList.map(({ title, logo: LogoComponent, link }) => (
          <styles.Row
            key={title}
            href={link}
            target="_blank"
            rel="noreferrer"
          >
            <LogoComponent />
            <Translate value={title} />
          </styles.Row>
        ))}
      </styles.Column>
      <SocialNetwork socials={socials} color={colors.white} />
    </styles.Container>
  );
}
