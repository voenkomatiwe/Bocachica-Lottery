import { ReactComponent as BookIcon } from 'assets/images/icons/book.svg';
import { ReactComponent as LightningIcon } from 'assets/images/icons/lightning.svg';
import { ReactComponent as LinkIcon } from 'assets/images/icons/link.svg';
import { ReactComponent as ListIcon } from 'assets/images/icons/list.svg';
import { IBurgerMenu } from 'shared/interfaces';

export const burgerMenuList: IBurgerMenu[] = [
  {
    title: 'burgerMenu.about',
    logo: LightningIcon,
    link: 'https://medium.com/boca-chica/boca-chica-nft-auction-how-it-works-f419267d6ac2',
  },
  {
    title: 'burgerMenu.whitepaper',
    logo: BookIcon,
    link: 'https://bocachica-static.fra1.digitaloceanspaces.com/docs/Boca%20Chica%20NFT%20Auction%20WP.pdf',
  },
  {
    title: 'burgerMenu.risksAndRules',
    logo: ListIcon,
    link: 'https://bocachica-static.fra1.digitaloceanspaces.com/docs/bcme_risks.pdf',
  },
];

export const launchpadsList: IBurgerMenu[] = [
  {
    title: 'burgerMenu.openMoon',
    logo: LinkIcon,
    link: 'https://moon.bocachica.io/',
  },
  {
    title: 'burgerMenu.openMars',
    logo: LinkIcon,
    link: 'https://mars.bocachica.io/',
  },
];
