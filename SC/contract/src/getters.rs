use crate::*;

pub trait Getters {
    fn get_join_fee(&self) -> U128;
    fn get_num_accounts(&self) -> u64;
    fn get_auctions_accounts(&self, auction_id: u64) -> u64;
    fn get_winner(&self, auction_id: u64) -> AccountId;
    fn get_num_auctions(&self) -> u64;
    fn get_auction(&self, auction_id: u64) -> AuctionOutput;
    fn get_auctions(&self, from_index: u64, limit: u64) -> Vec<AuctionOutput>;
    fn get_auction_accounts(
        &self,
        auction_id: u64,
        from_index: u64,
        limit: u64,
    ) -> Vec<(AccountId, AuctionAccount)>;
    fn get_tickets(&self, auction_id: u64, from_index: u64, limit: u64) -> Vec<(u64, AccountId)>;
    fn get_auction_account(&self, auction_id: u64, account_id: AccountId) -> AuctionAccount;
    fn has_account(&self, account_id: AccountId) -> bool;
    fn is_nft_on_sale(&self, nft_id: String) -> bool;
    fn get_nft_sale(&self, nft_contract_id: String, nft_token_id: String) -> u64;
    fn get_ticket_info(&self, auction_id: u64, ticket_id: u64) -> AccountId;
    fn get_num_tickets(&self, auction_id: u64) -> u64;
}

impl Contract {
    fn get_auction_output(&self, auction: VAuction, auction_id: &u64) -> AuctionOutput {
        let mut output: AuctionOutput = auction.into();
        output.auction_id = Some(*auction_id);
        output
    }
}

#[near_bindgen]
impl Getters for Contract {
    fn get_join_fee(&self) -> U128 {
        self.join_fee.into()
    }

    fn get_num_accounts(&self) -> u64 {
        self.num_accounts
    }

    fn get_auctions_accounts(&self, auction_id: u64) -> u64 {
        let auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        auction.auction_accounts.len()
    }

    fn get_num_tickets(&self, auction_id: u64) -> u64 {
        let auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        auction.lottery_tickets.len()
    }

    fn get_winner(&self, auction_id: u64) -> AccountId {
        let auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();

        auction.winner_id
    }

    fn get_num_auctions(&self) -> u64 {
        self.num_auctions
    }

    fn get_auction(&self, auction_id: u64) -> AuctionOutput {
        self.get_auction_output(
            self.auctions.get(&auction_id).expect("ERR_NO_AUCTION"),
            &auction_id,
        )
    }

    fn get_auctions(&self, from_index: u64, limit: u64) -> Vec<AuctionOutput> {
        (from_index..std::cmp::min(from_index + limit, self.num_auctions))
            .filter_map(|auction_id| {
                self.auctions
                    .get(&auction_id)
                    .map(|auction| self.get_auction_output(auction, &auction_id))
            })
            .collect()
    }

    fn get_auction_accounts(
        &self,
        auction_id: u64,
        from_index: u64,
        limit: u64,
    ) -> Vec<(AccountId, AuctionAccount)> {
        let auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        auction
            .auction_accounts
            .iter()
            .skip(from_index as usize)
            .take(limit as usize)
            .map(|(id, acc)| (id, acc.into()))
            .collect()
    }

    fn get_auction_account(&self, auction_id: u64, account_id: AccountId) -> AuctionAccount {
        let auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        match auction.auction_type {
            AuctionType::Auction => auction
                .auction_accounts
                .get(&account_id)
                .expect("ERR no such account")
                .into(),
            AuctionType::Lottery => panic!("Invalid method for this type Auction"),
        }
    }

    fn get_ticket_info(&self, auction_id: u64, ticket_id: u64) -> AccountId {
        let auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        match auction.auction_type {
            AuctionType::Lottery => auction
                .lottery_tickets
                .get(&ticket_id)
                .expect("ERR no such account"),
            AuctionType::Auction => panic!("Invalid method for this type Auction"),
        }
    }

    fn has_account(&self, account_id: AccountId) -> bool {
        self.accounts.contains_key(&account_id)
    }

    fn is_nft_on_sale(&self, nft_id: String) -> bool {
        if let Some(auction_id) = self.nft_on_sale.get(&nft_id) {
            let auction: Auction = self
                .auctions
                .get(&auction_id)
                .expect("ERR_NO_AUCTION")
                .into();
            // return true if auction not ended or/and someone has participated
            !(auction.end_date < env::block_timestamp() && auction.collected_amount == 0)
        } else {
            false
        }
    }

    fn get_nft_sale(&self, nft_contract_id: String, nft_token_id: String) -> u64 {
        let nft_id = format!("{}{}", nft_contract_id, nft_token_id);
        self.nft_on_sale.get(&nft_id).expect("NFT_NOT_ON_SALE")
    }

    fn get_tickets(&self, auction_id: u64, from_index: u64, limit: u64) -> Vec<(u64, AccountId)> {
        let auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        auction
            .lottery_tickets
            .iter()
            .skip(from_index as usize)
            .take(limit as usize)
            .map(|(id, acc)| (id, acc.into()))
            .collect()
    }
}
