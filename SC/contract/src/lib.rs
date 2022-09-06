use near_contract_standards::fungible_token::core_impl::ext_fungible_token;
use near_contract_standards::fungible_token::receiver::FungibleTokenReceiver;
use near_contract_standards::non_fungible_token::{Token, TokenId};
use near_sdk::borsh::{self, BorshDeserialize, BorshSerialize};
use near_sdk::collections::{LookupMap, UnorderedMap};
use near_sdk::json_types::{U128, U64};
use near_sdk::serde::{Deserialize, Serialize};
use near_sdk::{
    assert_one_yocto, env, ext_contract, is_promise_success, log, near_bindgen, serde_json,
    AccountId, Balance, BorshStorageKey, Gas, PanicOnDefault, Promise, PromiseOrValue,
    PromiseResult, Timestamp, ONE_YOCTO,
};

pub mod aml;
pub mod auction;
pub mod claim;
pub mod getters;
pub mod owner;
mod token_receiver;

pub use crate::auction::*;
pub use aml::*;
pub use claim::*;
pub use getters::*;
pub use owner::*;
pub use token_receiver::*;

const GAS_GET_NFT_TOKEN: Gas = Gas(5_000_000_000_000);
const NO_DEPOSIT: Balance = 0;
const GAS_FOR_FT_TRANSFER: Gas = Gas(10_000_000_000_000);
const GAS_FOR_AFTER_FT_TRANSFER: Gas = Gas(10_000_000_000_000);
const GAS_FOR_CREATE_AUCTION: Gas = Gas(5_000_000_000_000);
const GAS_FOR_CALLBACK_TRANSFER_NFT: Gas = Gas(5_000_000_000_000);
const REFUND_GAS: Gas = Gas(20_000_000_000_000);

const MAX_VALID_DATE: u64 = 10_000_000_000_000_000_000; // 2286 year

#[ext_contract(ext_self)]
pub trait ExtContract {
    /// Callback after account creation.
    fn on_create_account(&mut self, new_account_id: AccountId) -> Promise;

    fn after_ft_on_transfer_near_deposit(
        &mut self,
        sender_id: AccountId,
        deposit_amount: U128,
    ) -> PromiseOrValue<U128>;

    /// Callback after token refund for subscription sales
    fn after_refund_purchase(
        &mut self,
        account_id: AccountId,
        amount_to_refund: U128,
        auction_id: u64,
    ) -> bool;

    fn check_ownership_nft(&self);
    fn callback_create_auction(&mut self, auction: AuctionInput, #[callback] result: bool) -> u64;
    fn callback_transfer_nft(&mut self, auction_id: u64) -> bool;
    fn callback_aml_operation(
        &mut self,
        #[callback] category_risk: CategoryRisk,
        bid: BidInfo,
    ) -> U128;
    fn handle_refund_near(&self, bid: BidInfo);
}

#[derive(BorshStorageKey, BorshSerialize)]
pub(crate) enum StorageKey {
    Accounts,
    Auctions,
    AccountAuctions { auction_id: u64 },
    NFTOnSale,
    Metadata { auction_id: u64 },
    AmlCategory,
}

#[near_bindgen]
#[derive(BorshSerialize, BorshDeserialize, PanicOnDefault)]
struct Contract {
    owner_id: AccountId,
    join_fee: Balance,
    accounts: LookupMap<AccountId, Balance>,
    auctions: LookupMap<u64, VAuction>,
    num_auctions: u64,
    num_accounts: u64,
    nft_on_sale: LookupMap<String, u64>,
    aml: AML,
}

#[near_bindgen]
impl Contract {
    #[allow(dead_code)]
    #[init]
    pub fn new(owner_id: AccountId, join_fee: U128, aml_account_id: AccountId) -> Self {
        let mut this = Self {
            owner_id,
            join_fee: join_fee.0,
            accounts: LookupMap::new(StorageKey::Accounts),
            auctions: LookupMap::new(StorageKey::Auctions),
            num_auctions: 0,
            num_accounts: 0,
            nft_on_sale: LookupMap::new(StorageKey::NFTOnSale),
            aml: AML::new(aml_account_id, "All".to_string(), INITIAL_MAX_RISK_LEVEL),
        };
        this.accounts.insert(&this.owner_id, &0);
        this.num_accounts += 1;
        this
    }

    #[allow(dead_code)]
    #[payable]
    pub fn join(&mut self) {
        let account_id = env::predecessor_account_id();
        assert!(
            !self.accounts.contains_key(&account_id),
            "ERR_ACCOUNT_EXISTS"
        );
        assert_eq!(env::attached_deposit(), self.join_fee, "ERR_FEE");
        self.accounts.insert(&account_id, &env::attached_deposit());
        self.num_accounts += 1;
    }

    #[allow(dead_code)]
    #[private]
    pub fn change_join_fee(&mut self, join_fee: u128) -> U128 {
        self.join_fee = join_fee;
        U128(self.join_fee)
    }
}
