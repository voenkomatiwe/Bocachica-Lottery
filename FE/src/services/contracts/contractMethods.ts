export const ftViewMethods: string[] = [
  'ft_metadata',
  'ft_balance_of',
  'storage_balance_of',
  'storage_balance_bounds',
];
export const ftChangeMethods: string[] = ['ft_transfer_call', 'deposit_near'];

export const nftViewMethods: string[] = ['nft_metadata', 'nft_token'];
export const nftChangeMethods: string[] = ['ft_transfer_call'];

export const lotteryChangeMethods: string[] = [
  'claim_refund',
  'claim_nft',
];
export const lotteryViewMethods: string[] = [
  'get_num_auctions',
  'get_auction',
  'get_auctions',
  'get_num_accounts',
  'get_auctions_accounts',
  'get_winner',
  'get_auction_account',
  'get_auction_accounts',
  'has_account',
  'get_join_fee',
  'get_num_tickets',
  'get_ticket_info',
];
