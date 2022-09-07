import { ReactComponent as Medium } from 'assets/images/social-icons/medium-icon.svg';
import { ReactComponent as Telegram } from 'assets/images/social-icons/telegram-icon.svg';
import { ReactComponent as Twitter } from 'assets/images/social-icons/twitter-icon.svg';
import { IAuction } from 'providers/interfaces';
import { ESocial, ISocials } from 'shared/interfaces';

export const socials: ISocials[] = [
  { value: 'https://medium.com/boca-chica', type: ESocial.Medium },
  { value: 'https://t.me/BocaChicaAnnouncement', type: ESocial.Telegram },
  { value: 'https://twitter.com/bocachica_io', type: ESocial.Twitter },
];

export const getAuctionSocials = (auction: IAuction): ISocials[] => [
  { value: auction.links.mediumLink, type: ESocial.Medium },
  { value: auction.links.telegramLink, type: ESocial.Telegram },
  { value: auction.links.twitterLink, type: ESocial.Twitter },
];

export const ImageMap:{ [key:number]: React.FunctionComponent<React.SVGProps<SVGSVGElement>> } = {
  [ESocial.Medium]: Medium,
  [ESocial.Telegram]: Telegram,
  [ESocial.Twitter]: Twitter,
};
