use crate::*;

pub trait Claim {
    fn claim_refund(&mut self, auction_id: u64) -> Promise;
    fn claim_nft(&mut self, auction_id: u64, connection_data: String) -> Promise;
    fn after_refund_purchase(
        &mut self,
        account_id: AccountId,
        amount_to_refund: U128,
        auction_id: u64,
    ) -> bool;
    fn approve_receiving(&mut self, auction_id: u64);
}

#[near_bindgen]
impl Claim for Contract {
    fn claim_refund(&mut self, auction_id: u64) -> Promise {
        let mut auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();

        assert!(auction.refund_available, "ERR_REFUND_NOT_AVAILABLE");
        assert!(
            env::block_timestamp() > auction.end_date,
            "ERR_AUCTION_IN_PROGRESS"
        );

        let account_id = env::predecessor_account_id();
        let mut account_auction: AuctionAccount = auction
            .auction_accounts
            .get(&account_id)
            .expect("ERR_ACCOUNT_NOT_FOUND")
            .into();

        assert_ne!(account_auction.amount.0, 0, "ERR_NO_ALLOCATION");
        assert_ne!(
            account_id, auction.winner_id,
            "ERR_WINNER_CAN_NOT_REFUND_TOKENS"
        );
        assert!(!account_auction.refunded, "ERR_ALREADY_REFUNDED");

        let amount_to_refund = account_auction.amount.0;
        account_auction.refunded = true;

        let token_account_id = auction.deposit_token_id.clone();

        auction
            .auction_accounts
            .insert(&account_id, &VAuctionAccount::Current(account_auction));
        self.auctions
            .insert(&auction_id, &VAuction::Current(auction));

        if token_account_id == AccountId::new_unchecked(NEAR_ACCOUNT.to_string()) {
            log!("Refund {} near to {}", amount_to_refund, account_id);
            Promise::new(account_id).transfer(amount_to_refund)
        } else {
            self.refund_purchase(account_id, amount_to_refund, token_account_id, auction_id)
        }
    }

    #[payable]
    fn claim_nft(&mut self, auction_id: u64, connection_data: String) -> Promise {
        assert_one_yocto();
        let mut auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();

        assert!(auction.claim_available, "ERR_CLAIM_NOT_AVAILABLE");
        assert!(
            env::block_timestamp() > auction.end_date,
            "ERR_AUCTION_IN_PROGRESS"
        );

        assert!(!auction.nft_claimed, "ERR_NFT_ALREADY_CLAIMED");

        let account_id = env::predecessor_account_id();

        if auction.auction_type == AuctionType::Auction {
            let account_auction: AuctionAccount = auction
                .auction_accounts
                .get(&account_id)
                .expect("ERR_ACCOUNT_NOT_FOUND")
                .into();

            assert_ne!(account_auction.amount.0, 0, "ERR_NO_ALLOCATION");
        }
        assert_eq!(
            account_id, auction.winner_id,
            "ERR_ONLY_WINNER_CAN_CLAIM_PURCHASE"
        );

        auction.auction_status = AuctionStatus::Connection;
        auction.connection_data = connection_data;

        let nft_contract_id = auction.nft_contract_id.clone();
        let nft_token_id = auction.nft_token_id.clone();

        self.auctions
            .insert(&auction_id, &VAuction::Current(auction));

        ext_non_fungible_token::nft_transfer(
            env::predecessor_account_id(),
            nft_token_id,
            None,
            None,
            nft_contract_id,
            ONE_YOCTO,
            GAS_FOR_FT_TRANSFER,
        )
        .then(ext_self::callback_transfer_nft(
            auction_id,
            env::current_account_id(),
            NO_DEPOSIT,
            GAS_FOR_CALLBACK_TRANSFER_NFT,
        ))
    }

    #[private]
    fn after_refund_purchase(
        &mut self,
        account_id: AccountId,
        amount_to_refund: U128,
        auction_id: u64,
    ) -> bool {
        let promise_success = is_promise_success();
        if !promise_success {
            let mut auction: Auction = self
                .auctions
                .get(&auction_id)
                .expect("ERR_NO_AUCTION")
                .into();

            if let Some(v_auction_account) = auction.auction_accounts.get(&account_id) {
                let mut account_auction: AuctionAccount = v_auction_account.into();
                account_auction.refunded = false;
                auction
                    .auction_accounts
                    .insert(&account_id, &VAuctionAccount::Current(account_auction));
                self.auctions
                    .insert(&auction_id, &VAuction::Current(auction));
                log!(
                    "Purchase refund for {} failed. Tokens to recharge: {}",
                    account_id,
                    amount_to_refund.0
                );
            }
        }
        promise_success
    }

    fn approve_receiving(&mut self, auction_id: u64) {
        let mut auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();

        let account_id = env::predecessor_account_id();

        assert_eq!(
            account_id, auction.winner_id,
            "ERR_ONLY_WINNER_CAN_APPROVE_RECEIVING"
        );

        auction.auction_status = AuctionStatus::Received;
        self.auctions
            .insert(&auction_id, &VAuction::Current(auction));
    }
}

impl Contract {
    fn refund_purchase(
        &mut self,
        recipient_account_id: AccountId,
        amount_to_refund: Balance,
        token_account_id: AccountId,
        auction_id: u64,
    ) -> Promise {
        ext_fungible_token::ft_transfer(
            recipient_account_id.clone(),
            amount_to_refund.into(),
            Some(format!(
                "Refund {} of {}. Auction #{}",
                amount_to_refund, token_account_id, auction_id
            )),
            token_account_id,
            ONE_YOCTO,
            GAS_FOR_FT_TRANSFER,
        )
        .then(ext_self::after_refund_purchase(
            recipient_account_id,
            amount_to_refund.into(),
            auction_id,
            env::current_account_id(),
            NO_DEPOSIT,
            GAS_FOR_AFTER_FT_TRANSFER,
        ))
    }
}
