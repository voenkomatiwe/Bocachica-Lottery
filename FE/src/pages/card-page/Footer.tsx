import SocialNetwork from 'shared/components/SocialNetwork';
import { ISocials } from 'shared/interfaces';
import { colors } from 'shared/theme';

import styles from './styles';

interface IFooter {
  socials: ISocials[],
  projectLink: string | null,
}

export default function Footer({ socials, projectLink }: IFooter) {
  const hostname = projectLink ? new URL(projectLink).hostname : null;
  return (
    <styles.Footer>
      <SocialNetwork socials={socials} color={colors.black} />
      {projectLink && hostname && (
      <styles.ProjectLink
        href={projectLink}
        target="_blank"
        rel="noreferrer"
      >
        <p>{hostname}</p>
        <styles.LinkIcon />
      </styles.ProjectLink>
      )}
    </styles.Footer>
  );
}
