use crate::*;
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct BidInfo {
    pub auction_id: u64,
    pub amount: u128,
    pub token_id: AccountId,
    pub sender_id: AccountId,
}

#[allow(dead_code)]
impl Contract {
    pub fn internal_ft_on_transfer(&mut self, bid: BidInfo) -> U128 {
        // Check that account is registered.
        assert!(
            self.accounts.contains_key(&bid.sender_id),
            "ERR_NOT_REGISTERED_ACCOUNT"
        );
        let auction: Auction = self
            .auctions
            .get(&bid.auction_id)
            .expect("ERR_NO_AUCTION")
            .into();
        assert_eq!(auction.deposit_token_id, bid.token_id, "ERR_WRONG_TOKEN");
        let timestamp = env::block_timestamp();
        assert!(timestamp >= auction.start_date, "ERR_AUCTION_NOT_STARTED");
        assert!(timestamp <= auction.end_date, "ERR_AUCTION_DONE");
        match auction.auction_type {
            AuctionType::Auction => U128(self.internal_auction_deposit(bid)),
            AuctionType::Lottery => U128(self.internal_buy_lottery(bid)),
        }
    }

    /// Validates deposit and records it for the given user for give auction.
    fn internal_auction_deposit(&mut self, bid: BidInfo) -> Balance {
        let mut auction: Auction = self
            .auctions
            .get(&bid.auction_id)
            .expect("ERR_NO_AUCTION")
            .into();

        let mut account_auction = auction
            .auction_accounts
            .get(&bid.sender_id)
            .map(|account_auction| account_auction.into())
            .unwrap_or(AuctionAccount {
                amount: U128(0),
                refunded: false,
            });

        account_auction.amount = U128(account_auction.amount.0 + bid.amount);
        assert!(
            account_auction.amount.0 > auction.initial_price,
            "BID_MUST_BE_GRATER_THEN_INITIAL_PRICE"
        );

        assert!(
            account_auction.amount.0 > auction.winner_bid,
            "BID_MUST_BE_GRATER_THEN_WINNER_BID"
        );

        if let Some(min_step) = auction.auction_min_step {
            assert!(
                account_auction.amount.0 >= auction.winner_bid + min_step,
                "BID_MUST_BE_GREATER_ON_MIN_STEP {}",
                min_step
            );
        }

        let timestamp = env::block_timestamp();
        let mut bought_by_buyout: bool = false;

        if let Some(buyout_price) = auction.buyout_price {
            if account_auction.amount.0 >= buyout_price {
                auction.end_date = timestamp;
                bought_by_buyout = true;
            }
        }

        if let Some(auction_step) = auction.auction_step {
            if !bought_by_buyout {
                assert_eq!(
                    account_auction.amount.0,
                    auction.winner_bid + auction_step,
                    "BID_MUST_CORRESPOND_ON_AUCTION_STEP"
                );
            }
        }

        if let Some(added_time) = auction.added_time {
            if timestamp + added_time > auction.end_date && !bought_by_buyout {
                auction.end_date = timestamp + added_time;
                log!("New end time is: {}", auction.end_date);
            }
        }

        auction.winner_id = bid.sender_id.clone();
        auction.winner_bid = account_auction.amount.0;

        auction
            .auction_accounts
            .insert(&bid.sender_id, &VAuctionAccount::Current(account_auction));
        auction.collected_amount += bid.amount;
        self.auctions
            .insert(&bid.auction_id, &VAuction::Current(auction));
        0
    }

    /// Validates deposit and records it for the given user for give auction.
    fn internal_buy_lottery(&mut self, bid: BidInfo) -> Balance {
        let mut auction: Auction = self
            .auctions
            .get(&bid.auction_id)
            .expect("ERR_NO_AUCTION")
            .into();

        let ticket_price: u128 = auction.auction_step.expect("ERR no ticket price");

        assert!(bid.amount >= ticket_price, "ERROR_DEPOSIT");

        let mut amount = bid.amount;
        while amount >= ticket_price {
            auction
                .lottery_tickets
                .insert(&(self.get_num_tickets(bid.auction_id) + 1), &bid.sender_id);

            auction.collected_amount += ticket_price;
            amount = amount - ticket_price;
        }
        self.auctions
            .insert(&bid.auction_id, &VAuction::Current(auction));
        amount
    }
}

#[near_bindgen]
impl FungibleTokenReceiver for Contract {
    /// Callback on receiving tokens by this contract.
    fn ft_on_transfer(
        &mut self,
        sender_id: AccountId,
        amount: U128,
        msg: String,
    ) -> PromiseOrValue<U128> {
        let auction_id = serde_json::from_str::<u64>(&msg).expect("ERR_MSG_WRONG_FORMAT");

        let bid: BidInfo = BidInfo {
            auction_id,
            amount: amount.0,
            token_id: env::predecessor_account_id(),
            sender_id: sender_id.clone(),
        };

        ext_aml::get_address(sender_id, self.aml.account_id.clone(), 0, AML_CHECK_GAS)
            // In callback_aml_operation we first check the result
            .then(ext_self::callback_aml_operation(
                bid,
                env::current_account_id(),
                env::attached_deposit(),
                AML_CHECK_GAS,
            ))
            .into()
    }
}

pub trait NearReceiver {
    fn deposit_near(&mut self, auction_id: u64);
}

#[near_bindgen]
impl NearReceiver for Contract {
    #[payable]
    fn deposit_near(&mut self, auction_id: u64) {
        let bid: BidInfo = BidInfo {
            auction_id,
            amount: env::attached_deposit(),
            token_id: AccountId::new_unchecked(NEAR_ACCOUNT.to_string()),
            sender_id: env::predecessor_account_id(),
        };

        ext_aml::get_address(
            bid.sender_id.clone(),
            self.aml.account_id.clone(),
            0,
            AML_CHECK_GAS,
        )
        // In callback_aml_operation we first check the result
        .then(ext_self::callback_aml_operation(
            bid.clone(),
            env::current_account_id(),
            env::attached_deposit(),
            CALLBACK_AML_GAS,
        ))
        // In handle_refund_near we return near
        .then(ext_self::handle_refund_near(
            bid,
            env::current_account_id(),
            0,
            REFUND_GAS,
        ));
    }
}

#[near_bindgen]
impl Contract {
    #[private]
    #[payable]
    pub fn callback_aml_operation(
        &mut self,
        #[callback] category_risk: CategoryRisk,
        bid: token_receiver::BidInfo,
    ) -> U128 {
        self.assert_risk(category_risk);
        self.internal_ft_on_transfer(bid)
    }

    #[private]
    pub fn handle_refund_near(&self, bid: token_receiver::BidInfo) {
        if !is_promise_success() {
            log!("Return {} near to {}", bid.amount, bid.sender_id);
            Promise::new(bid.sender_id).transfer(bid.amount);
        }
    }
}
