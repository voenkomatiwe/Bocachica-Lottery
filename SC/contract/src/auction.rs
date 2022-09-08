use near_sdk::collections::LazyOption;

use crate::*;

pub const NEAR_ACCOUNT: &str = "near";

#[ext_contract(ext_wrap_near)]
pub trait ExtWrapNear {
    /// Deposit NEAR to mint wNEAR tokens to the predecessor account in this contract.
    fn near_deposit(&mut self);
}

#[ext_contract(ext_non_fungible_token)]
pub trait NonFungibleToken {
    fn nft_token(&self, token_id: TokenId) -> Option<Token>;

    fn nft_transfer(
        &mut self,
        receiver_id: AccountId,
        token_id: TokenId,
        approval_id: Option<u64>,
        memo: Option<String>,
    );
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum VMetadata {
    Current(Metadata),
}
#[derive(Serialize, Deserialize, BorshDeserialize, BorshSerialize, PartialEq, Debug, Clone)]
#[serde(crate = "near_sdk::serde")]
pub struct Metadata {
    /// link for a project
    pub project_link: Option<String>,
    /// link for a twitter
    pub twitter_link: Option<String>,
    /// link for a medium
    pub medium_link: Option<String>,
    /// link for a telegram
    pub telegram_link: Option<String>,
}

impl From<VMetadata> for Metadata {
    fn from(v_metadata: VMetadata) -> Self {
        match v_metadata {
            VMetadata::Current(v_metadata) => v_metadata,
        }
    }
}

/// Auction information for creating new auction.
#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct AuctionInput {
    // nft contract address
    pub nft_contract_id: AccountId,
    // nft token ID
    pub nft_token_id: TokenId,
    /// Token id.
    pub deposit_token_id: AccountId,
    /// The price for which you can buy without bidding.
    pub buyout_price: Option<U128>,
    /// Start date of the auction.
    pub start_date: U64,
    /// End date of the auction.
    pub end_date: U64,
    /// initial_price
    pub initial_price: U128,
    /// Auction step, fixed diff between bid
    pub auction_step: Option<U128>,
    /// Auction step, min diff between bid
    pub auction_min_step: Option<U128>,
    /// Time that adds after every bid
    pub added_time: Option<U64>,
    /// Metadata
    pub metadata: Metadata,
    /// auction type
    pub auction_type: AuctionType,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct AuctionOutput {
    pub auction_id: Option<u64>,
    pub nft_contract_id: AccountId,
    pub nft_token_id: TokenId,
    pub deposit_token_id: AccountId,
    pub claim_available: bool,
    pub refund_available: bool,
    pub buyout_price: Option<U128>,
    pub start_date: U64,
    pub end_date: U64,
    pub collected_amount: U128,
    pub num_auction_accounts: u64,
    pub initial_price: U128,
    pub auction_step: Option<U128>,
    pub auction_min_step: Option<U128>,
    pub winner_id: AccountId,
    pub winner_bid: U128,
    pub added_time: Option<U64>,
    pub nft_claimed: bool,
    pub metadata: Metadata,
    pub auction_type: AuctionType,
}

/// Auction information.
#[derive(BorshSerialize, BorshDeserialize)]
pub enum VAuction {
    Current(Auction),
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum AuctionType {
    Auction,
    Lottery,
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize, PartialEq, Debug)]
#[serde(crate = "near_sdk::serde")]
pub enum AuctionStatus {
    Active,
    EndedWithoutCollectedSum,
    Connection,
    Sending,
    Received,
}

#[derive(BorshSerialize, BorshDeserialize)]
pub struct Auction {
    pub nft_contract_id: AccountId,
    pub nft_token_id: TokenId,
    pub deposit_token_id: AccountId,
    pub claim_available: bool,
    pub refund_available: bool,
    pub buyout_price: Option<Balance>,
    pub start_date: Timestamp,
    pub end_date: Timestamp,
    pub collected_amount: Balance,
    pub auction_accounts: UnorderedMap<AccountId, VAuctionAccount>,
    pub lottery_tickets: UnorderedMap<u64, AccountId>,
    pub initial_price: Balance,
    pub auction_step: Option<Balance>,
    pub auction_min_step: Option<Balance>,
    pub winner_id: AccountId,
    pub winner_bid: Balance,
    pub added_time: Option<Timestamp>,
    pub nft_claimed: bool,
    pub metadata: LazyOption<VMetadata>,
    pub auction_type: AuctionType,
    pub connection_data: String,
    pub auction_status: AuctionStatus,
}

impl From<VAuction> for Auction {
    fn from(v_auction: VAuction) -> Self {
        match v_auction {
            VAuction::Current(auction) => auction,
        }
    }
}

impl From<VAuction> for AuctionOutput {
    fn from(v_auction: VAuction) -> Self {
        match v_auction {
            VAuction::Current(auction) => AuctionOutput {
                auction_id: None,
                nft_contract_id: auction.nft_contract_id,
                nft_token_id: auction.nft_token_id,
                deposit_token_id: auction.deposit_token_id,
                claim_available: auction.claim_available,
                refund_available: auction.refund_available,
                buyout_price: auction.buyout_price.map(U128),
                start_date: U64(auction.start_date),
                end_date: U64(auction.end_date),
                collected_amount: U128(auction.collected_amount),
                num_auction_accounts: auction.lottery_tickets.len(),
                auction_step: auction.auction_step.map(U128),
                auction_min_step: auction.auction_min_step.map(U128),
                initial_price: U128(auction.initial_price),
                winner_id: auction.winner_id,
                winner_bid: U128(auction.winner_bid),
                added_time: auction.added_time.map(U64),
                nft_claimed: auction.nft_claimed,
                metadata: auction.metadata.get().unwrap().into(),
                auction_type: auction.auction_type,
            },
        }
    }
}

impl VAuction {
    pub fn new(auction_id: u64, auction_input: AuctionInput) -> Self {
        Self::Current(Auction {
            nft_contract_id: auction_input.nft_contract_id,
            nft_token_id: auction_input.nft_token_id,
            deposit_token_id: auction_input.deposit_token_id,
            buyout_price: auction_input.buyout_price.map(|amount| amount.into()),
            start_date: auction_input.start_date.0,
            end_date: auction_input.end_date.0,
            collected_amount: 0,
            auction_accounts: UnorderedMap::new(StorageKey::AccountAuctions { auction_id }),
            lottery_tickets: UnorderedMap::new(StorageKey::AccountAuctions { auction_id }),
            auction_step: auction_input.auction_step.map(|step| step.into()),
            auction_min_step: auction_input.auction_min_step.map(|step| step.into()),
            initial_price: auction_input.initial_price.into(),
            claim_available: true,
            refund_available: true,
            winner_id: env::predecessor_account_id(),
            winner_bid: 0,
            added_time: auction_input.added_time.map(|time| time.into()),
            nft_claimed: false,
            metadata: LazyOption::new(
                StorageKey::Metadata { auction_id },
                Some(&VMetadata::Current(auction_input.metadata)),
            ),
            auction_type: auction_input.auction_type,
            connection_data: String::new(),
            auction_status: AuctionStatus::Active,
        })
    }
}

/// Account deposits for the a auction.
#[derive(BorshSerialize, BorshDeserialize)]
pub enum VAuctionAccount {
    Current(AuctionAccount),
}

#[derive(BorshSerialize, BorshDeserialize, Serialize, Deserialize)]
#[serde(crate = "near_sdk::serde")]
pub struct AuctionAccount {
    pub amount: U128,
    pub refunded: bool,
}

impl From<VAuctionAccount> for AuctionAccount {
    fn from(v_account_auction: VAuctionAccount) -> Self {
        match v_account_auction {
            VAuctionAccount::Current(account_auction) => account_auction,
        }
    }
}

#[near_bindgen]
impl Contract {
    #[private]
    fn check_ownership(&self, result: Vec<u8>) -> bool {
        let nft_token = near_sdk::serde_json::from_slice::<Option<Token>>(&result)
            .unwrap()
            .expect("ERR_NFT_DOES_NOT_EXIST");
        nft_token.owner_id == env::current_account_id()
    }

    #[allow(dead_code)]
    #[private]
    pub fn check_ownership_nft(&self) -> bool {
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => panic!("ERR_CAN_NOT_RETRIEVE_NFT"),
            PromiseResult::Successful(result) => self.check_ownership(result),
        }
    }

    #[allow(dead_code)]
    #[private]
    pub fn callback_transfer_nft(&mut self, auction_id: u64) -> bool {
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => panic!("NFT_NOT_TRANSFERRED"),
            PromiseResult::Successful(_) => {
                let mut auction: Auction = self
                    .auctions
                    .get(&auction_id)
                    .expect("ERR_NO_AUCTION")
                    .into();

                auction.nft_claimed = true;

                let nft_id = format!("{}{}", auction.nft_contract_id, auction.nft_token_id);
                self.nft_on_sale.remove(&nft_id);

                self.auctions
                    .insert(&auction_id, &VAuction::Current(auction));

                true
            }
        }
    }

    #[allow(dead_code)]
    #[private]
    pub fn callback_create_auction(&mut self, auction: AuctionInput) -> u64 {
        match env::promise_result(0) {
            PromiseResult::NotReady => unreachable!(),
            PromiseResult::Failed => panic!("ERR_NFT_DOES_NOT_EXIST"),
            PromiseResult::Successful(result) => {
                assert!(
                    self.check_ownership(result),
                    "ERR_CONTRACT_DOES_NOT_OWN_THE_NFT"
                );

                let auction_id = self.num_auctions;

                let nft_id = format!("{}{}", auction.nft_contract_id, auction.nft_token_id);
                self.nft_on_sale.insert(&nft_id, &auction_id);

                self.auctions
                    .insert(&auction_id, &VAuction::new(self.num_auctions, auction));

                self.num_auctions += 1;

                auction_id
            }
        }
    }

    #[allow(dead_code)]
    #[private]
    pub fn get_winner_ticket(&mut self, auction_id: u64) -> (u64, AccountId) {
        let mut auction: Auction = self
            .auctions
            .get(&auction_id)
            .expect("ERR_NO_AUCTION")
            .into();

        assert_eq!(
            auction.auction_type,
            AuctionType::Lottery,
            "ERR: no such method for Auction type"
        );

        assert_eq!(
            auction.winner_id,
            env::current_account_id(),
            "ERR: winner already determined"
        );

        let seed: [u8; 32] = env::random_seed().try_into().unwrap();

        let mut num: u64 = seed[0] as u64 * seed[1] as u64;

        while num > auction.lottery_tickets.len() {
            if seed[2] > 1 {
                num = num / seed[2] as u64;
            } else if seed[3] > 1 {
                num = num / seed[2] as u64;
            } else {
                num = num / 2;
            }
        }

        let nft_id = format!("{}{}", auction.nft_contract_id, auction.nft_token_id);
        self.nft_on_sale.remove(&nft_id);

        let winner_id = auction
            .lottery_tickets
            .get(&num)
            .expect("ERR_NO_SUCH_TICKET");
        auction.winner_id = winner_id.clone();
        auction.winner_bid = num as u128;

        self.auctions
            .insert(&auction_id, &VAuction::Current(auction));

        (num, winner_id)
    }
}
