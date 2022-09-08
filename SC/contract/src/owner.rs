use crate::*;

pub trait Ownable {
    fn assert_owner(&self);
    fn owner(&self) -> &AccountId;
    fn transfer_ownership(&mut self, owner: AccountId);
}

#[near_bindgen]
impl Ownable for Contract {
    fn owner(&self) -> &AccountId {
        &self.owner_id
    }

    fn transfer_ownership(&mut self, owner: AccountId) {
        self.assert_owner();
        self.owner_id = owner;
    }

    fn assert_owner(&self) {
        assert_eq!(
            &env::predecessor_account_id(),
            self.owner(),
            "ERR_MUST_BE_OWNER"
        );
    }
}

pub trait Owner {
    fn create_auction(&mut self, auction: AuctionInput) -> Promise;
    fn update_auction_dates(&mut self, auction_id: u64, start_date: U64, end_date: U64);
    fn update_auction_refund_available(&mut self, auction_id: u64, refund_available: bool);
    fn update_auction_claim_available(&mut self, auction_id: u64, claim_available: bool);
    fn remove_auction(&mut self, auction_id: u64);
    fn update_metadata(&mut self, auction_id: u64, metadata: Metadata);
    fn update_auction_status(&mut self, auction_id: u64, status: AuctionStatus);
}

#[near_bindgen]
impl Owner for Contract {
    fn create_auction(&mut self, auction: AuctionInput) -> Promise {
        self.assert_owner();

        let timestamp = env::block_timestamp();

        assert!(auction.start_date.0 > timestamp, "START_DATE_IS_TOO_SMALL");
        assert!(auction.end_date.0 < MAX_VALID_DATE, "END_DATE_IS_TOO_BIG");
        assert!(
            auction.start_date.0 < auction.end_date.0,
            "END_DATE_IS_TOO_SMALL"
        );

        if let Some(min_step) = auction.auction_min_step {
            assert!(min_step.0 > 0, "MIN_STEP_MUST_BE_POSITIVE_OR_NONE");
        }

        if let Some(step) = auction.auction_step {
            assert!(step.0 > 0, "STEP_MUST_BE_POSITIVE_OR_NONE");
            if let Some(min_step) = auction.auction_min_step {
                assert!(
                    step.0 >= min_step.0,
                    "MIN_STEP_MUST_BE_GREATER_OR_EQUAL_STEP"
                );
            }
        }

        if let Some(added_time) = auction.added_time {
            assert!(added_time.0 > 0, "ADDED_TIME_MUST_BE_POSITIVE_OR_NONE");
        }

        if let Some(buyout_price) = auction.buyout_price {
            assert!(
                buyout_price.0 > auction.initial_price.0,
                "BUYOUT_PRICE_MUST_BE_GRATER_INITIAL_PRICE_OR_NONE"
            );
        }

        if auction.auction_type == AuctionType::Lottery {
            assert!(auction.added_time.is_none(), "ERR_ADDED_TIME_FOR_LOTTERY");
            let ticket_price = auction
                .auction_step
                .expect("ERR_AUCTION_STEP_MUST_BE_FOR_LOTTERY");
            assert!(
                auction.auction_min_step.is_none(),
                "ERR_MIN_STEP_FOR_LOTTERY"
            );
            assert!(auction.initial_price.0 == 0, "ERR_INITAL_PRICE_FOR_LOTTERY");
            let target_amount = auction
                .buyout_price
                .expect("ERR_BUYOUT_PRICE_MUST_BE_FOR_LOTTERY");
            assert!(ticket_price.0 < target_amount.0, "ERR_TARGET_AMOUNT_SIZE");
        }

        let nft_id = format!("{}{}", auction.nft_contract_id, auction.nft_token_id);
        assert!(!self.is_nft_on_sale(nft_id), "NFT_IS_ALREADY_ON_SALE");

        ext_non_fungible_token::nft_token(
            auction.nft_token_id.clone(),
            auction.nft_contract_id.clone(),
            NO_DEPOSIT,
            GAS_GET_NFT_TOKEN,
        )
        .then(ext_self::callback_create_auction(
            auction,
            env::current_account_id(),
            NO_DEPOSIT,
            GAS_FOR_CREATE_AUCTION,
        ))
    }

    fn update_auction_dates(&mut self, auction_id: u64, start_date: U64, end_date: U64) {
        self.assert_owner();
        let mut auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();

        let timestamp = env::block_timestamp();
        assert!(timestamp <= auction.start_date, "ERR_AUCTION_STARTED");

        assert!(start_date.0 > timestamp, "START_DATE_IS_TOO_SMALL");
        assert!(end_date.0 < MAX_VALID_DATE, "END_DATE_IS_TOO_BIG");
        assert!(start_date.0 < end_date.0, "END_DATE_IS_TOO_SMALL");

        auction.start_date = start_date.into();
        auction.end_date = end_date.into();
        self.auctions
            .insert(&auction_id, &VAuction::Current(auction));
    }

    fn update_auction_refund_available(&mut self, auction_id: u64, refund_available: bool) {
        self.assert_owner();
        let mut auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        auction.refund_available = refund_available;
        self.auctions
            .insert(&auction_id, &VAuction::Current(auction));
    }

    fn update_auction_claim_available(&mut self, auction_id: u64, claim_available: bool) {
        self.assert_owner();
        let mut auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        auction.claim_available = claim_available;
        self.auctions
            .insert(&auction_id, &VAuction::Current(auction));
    }

    fn remove_auction(&mut self, auction_id: u64) {
        self.assert_owner();
        let auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        assert_eq!(auction.collected_amount, 0, "AUCTION_NOT_EMPTY");
        assert!(
            auction.start_date > env::block_timestamp(),
            "ERR_REMOVE_STARTED_AUCTION"
        );

        let nft_id = format!("{}{}", auction.nft_contract_id, auction.nft_token_id);
        self.nft_on_sale.remove(&nft_id);

        self.auctions.remove(&auction_id);
    }

    fn update_metadata(&mut self, auction_id: u64, metadata: Metadata) {
        self.assert_owner();
        let mut auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        auction.metadata.set(&VMetadata::Current(metadata));
        self.auctions
            .insert(&auction_id, &VAuction::Current(auction));
    }

    fn update_auction_status(&mut self, auction_id: u64, status: AuctionStatus) {
        self.assert_owner();

        let mut auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();

        match status {
            AuctionStatus::Received => panic!("ERR: only winner can accept"),
            _ => auction.auction_status = status,
        }
        self.auctions
            .insert(&auction_id, &VAuction::Current(auction));
    }
}
