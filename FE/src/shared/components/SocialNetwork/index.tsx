import styled from 'styled-components';

import { ISocials } from 'shared/interfaces';
import { ImageMap } from 'shared/utils/socialLinks';

export interface ISocialNetwork {
  socials: ISocials[],
  color: string,
}

const SocialNetworksWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SocialNetworksIcon = styled.a`
  margin-right: 2rem;
  & > svg {
    width: 36px;
    height: 36px;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-right: 1.5rem;
    white-space: nowrap;
    & > svg {
      width: 24px;
      height: 24px;
    }
  `}
`;

export default function SocialNetwork({ socials, color }: ISocialNetwork) {
  const socialsLength = socials.length;
  return (
    <SocialNetworksWrapper>
      {socialsLength && socials.map(({ value, type }) => {
        if (!value) return null;
        const Image = ImageMap[type];
        return (
          <SocialNetworksIcon
            key={value}
            href={value}
            target="_blank"
            rel="noreferrer"
          >
            <Image fill={color} />
          </SocialNetworksIcon>
        );
      })}
    </SocialNetworksWrapper>
  );
}
