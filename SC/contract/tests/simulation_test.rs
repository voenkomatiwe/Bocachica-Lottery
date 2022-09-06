use auction::{AuctionOutput, ContractContract as Contract, Metadata};

use near_contract_standards::non_fungible_token::Token;
use near_sdk::json_types::{U128, U64};
use near_sdk::serde_json::{self, json};
use near_sdk::AccountId;
use near_sdk_sim::{
    call, deploy, init_simulator, to_yocto, ContractAccount, ExecutionResult, UserAccount,
};

pub const AUCTION_CONTRACT_ID: &str = "auction";
pub const NFT_CONTRACT_ID: &str = "nft";
pub const TOKEN_ID: &str = "tokens";

use auction::auction::{AuctionAccount, AuctionInput};

near_sdk_sim::lazy_static_include::lazy_static_include_bytes! {
   pub  AUCTION_WASM_BYTES => "res/auction_release.wasm",
   pub  NFT_WASM_BYTES => "res/non_fungible_token.wasm",
   pub  FT_WASM_BYTES => "res/fungible_token.wasm",
   pub  AML_WASM_BYTES => "res/aml.wasm",
   pub  WRAP_NEAR => "res/w_near.wasm",
}

// Added after running simulation test -> with max token series id and 64 byte account
pub const STORAGE_MINT_ESTIMATE: u128 = 11280000000000000000000;
pub const STORAGE_CREATE_SERIES_ESTIMATE: u128 = 8540000000000000000000;
pub const STORAGE_APPROVE: u128 = 2610000000000000000000;
pub const JOIN_FEE: u128 = 5000000000000000;
const ONE_SEC_IN_NS: u64 = 1_000_000_000;
const DECIMALS: u32 = 24;

fn nft_id() -> AccountId {
    AccountId::new_unchecked(NFT_CONTRACT_ID.to_string())
}

fn contract_id() -> AccountId {
    AccountId::new_unchecked(AUCTION_CONTRACT_ID.to_string())
}

fn bob_id() -> AccountId {
    AccountId::new_unchecked("bob".to_string())
}

fn alice_id() -> AccountId {
    AccountId::new_unchecked("alice".to_string())
}

fn owner_id() -> AccountId {
    AccountId::new_unchecked("owner".to_string())
}

fn token_id() -> AccountId {
    AccountId::new_unchecked(TOKEN_ID.to_string())
}

fn aml_id() -> AccountId {
    AccountId::new_unchecked("aml".to_string())
}

fn wnear_id() -> AccountId {
    AccountId::new_unchecked("wrap.near".to_string())
}

fn near_id() -> AccountId {
    AccountId::new_unchecked("near".to_string())
}

fn assert_all_success(result: ExecutionResult) {
    let mut all_success = true;
    let mut all_results = String::new();
    for r in result.promise_results() {
        let x = r.expect("NO_RESULT");
        all_results = format!("{}\n{:?}", all_results, x);
        all_success &= x.is_ok();
    }
    for promise_result in result.promise_results() {
        println!("{:?}", promise_result.unwrap().outcome().logs);
    }
    assert!(
        all_success,
        "Not all promises where successful: \n\n{}",
        all_results
    );
}

fn assert_failure(outcome: ExecutionResult, error_message: &str) {
    let mut err_founded = false;

    for r in outcome.promise_results() {
        let exe_status = format!("{:?}", r.as_ref().unwrap().status());
        if exe_status.contains(error_message) {
            err_founded = true;
        }
        println!("{:?}", r.unwrap().outcome().logs);
    }

    assert!(err_founded);
}

fn in_decimal(amount: u128) -> u128 {
    let ten: u128 = 10;
    amount * ten.pow(DECIMALS) as u128
}

pub fn init() -> (
    UserAccount,
    ContractAccount<Contract>,
    UserAccount,
    UserAccount,
    UserAccount,
    UserAccount,
    UserAccount,
) {
    let root = init_simulator(None);

    let near = root.create_user(near_id(), to_yocto("100000"));
    let alice = near.create_user(alice_id(), to_yocto("10"));
    let bob = near.create_user(bob_id(), to_yocto("10"));
    let owner = near.create_user(owner_id(), to_yocto("20"));

    let auction_contract = deploy!(
        contract: Contract,
        contract_id: AUCTION_CONTRACT_ID.to_string(),
        bytes: &AUCTION_WASM_BYTES,
        signer_account: near,
        deposit: to_yocto("30"),
        init_method: new(owner_id(), U128(JOIN_FEE), aml_id())
    );

    // create NFT
    let nft_contract = near.deploy_and_init(
        &NFT_WASM_BYTES,
        nft_id(),
        "new_default_meta",
        &serde_json::to_vec(&json!({ "owner_id": owner_id() })).unwrap(),
        to_yocto("5"),
        near_sdk_sim::DEFAULT_GAS,
    );

    // create aml
    near.deploy_and_init(
        &AML_WASM_BYTES,
        aml_id(),
        "new",
        &serde_json::to_vec(&json!({ "owner_id": owner_id() })).unwrap(),
        to_yocto("5"),
        near_sdk_sim::DEFAULT_GAS,
    );

    assert_all_success(owner.call(
        aml_id(),
        "create_reporter",
        &serde_json::to_vec(&json!({"address": owner_id(), "permission_level": 2})).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ));

    assert_all_success(owner.call(
        aml_id(),
        "create_address",
        &serde_json::to_vec(&json!({"address": bob_id(), "category": "Scam", "risk": 5})).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ));

    //crate w_near

    near.deploy_and_init(
        &WRAP_NEAR,
        wnear_id(),
        "new",
        json!({}).to_string().into_bytes().as_ref(),
        to_yocto("5"),
        near_sdk_sim::DEFAULT_GAS,
    );

    // mint nft
    assert_all_success( owner.call(
        nft_id(),
        "nft_mint",
        &serde_json::to_vec(
            &json!({"token_id": "0", "receiver_id": contract_id(), "token_metadata": { "title": "Olympus Mons", "description": "Tallest mountain in charted solar system", "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg", "copies": 1}}),
        )
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        to_yocto("0.01")
    ));

    assert_all_success( owner.call(
        nft_id(),
        "nft_mint",
        &serde_json::to_vec(
            &json!({"token_id": "1", "receiver_id": nft_id(), "token_metadata": { "title": "Olympus Mons", "description": "Tallest mountain in charted solar system", "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg", "copies": 1}}),
        )
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        to_yocto("0.01")
    ));

    // create fungible token
    let token = near.deploy_and_init(
        &FT_WASM_BYTES,
        token_id(),
        "new",
        &serde_json::to_vec(&json!({ "owner_id": owner_id(),  "total_supply": in_decimal(10000000).to_string(), "metadata":{ "spec": "ft-1.0.0", "name": "Example Token Name", "symbol": "EXLT", "decimals": DECIMALS } })).unwrap(),
        to_yocto("1000"),
        near_sdk_sim::DEFAULT_GAS,
    );

    assert_all_success(bob.call(
        token_id(),
        "storage_deposit",
        &serde_json::to_vec(&json!({"account_id": bob_id(),})).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        to_yocto("0.00125"),
    ));
    assert_all_success(token.call(
        token_id(),
        "storage_deposit",
        &serde_json::to_vec(&json!({"account_id": alice_id(),})).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        to_yocto("0.00125"),
    ));
    assert_all_success(token.call(
        token_id(),
        "storage_deposit",
        &serde_json::to_vec(&json!({"account_id": contract_id(),})).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        to_yocto("0.00125"),
    ));

    // transfer tokens to bob
    assert_all_success(
        owner.call(
            token_id(),
            "ft_transfer",
            &serde_json::to_vec(
                &json!({"receiver_id": bob_id(), "amount": in_decimal(100).to_string()}),
            )
            .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            1,
        ),
    );

    // transfer tokens to alice
    assert_all_success(
        owner.call(
            token_id(),
            "ft_transfer",
            &serde_json::to_vec(
                &json!({"receiver_id": alice_id(), "amount": in_decimal(100).to_string()}),
            )
            .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            1,
        ),
    );

    (
        near,
        auction_contract,
        bob,
        alice,
        owner,
        token,
        nft_contract,
    )
}

fn create_auction(
    owner: &UserAccount,
    contract: &ContractAccount<Contract>,
    buyout_price: Option<U128>,
    auction_step: Option<U128>,
    auction_min_step: Option<U128>,
    added_time: Option<U64>,
) {
    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 4;

    assert_all_success(call!(
        owner,
        contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: token_id(),
            buyout_price,
            start_date: U64(start_date),
            end_date: U64(start_date + ONE_SEC_IN_NS * 40),
            initial_price: U128(0),
            auction_step,
            auction_min_step,
            added_time,
            metadata: default_metadata(),
        }),
        deposit = 0
    ));
}

fn get_auction_output(account: &UserAccount) -> AuctionOutput {
    account
        .view(
            contract_id(),
            "get_auction",
            &serde_json::to_vec(&json!({ "auction_id":  0_u64  })).unwrap(),
        )
        .unwrap_json::<AuctionOutput>()
}

fn bid(account: &UserAccount, amount: u128) {
    assert_all_success(
        account.call(
            token_id(),
            "ft_transfer_call",
            &serde_json::to_vec(&json!({"receiver_id": contract_id(),
         "amount": U128(in_decimal(amount) ),
         "msg": "0",
         "memo":  amount.to_string()}))
            .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            1,
        ),
    );
}

fn deposit_near(account: &UserAccount, amount: u128) -> ExecutionResult {
    account.call(
        contract_id(),
        "deposit_near",
        json!({ "auction_id": 0_u64 })
            .to_string()
            .into_bytes()
            .as_ref(),
        near_sdk_sim::DEFAULT_GAS,
        to_yocto(format!("{}", amount).as_str()),
    )
}

fn join(account: &UserAccount) {
    assert_all_success(account.call(
        contract_id(),
        "join",
        &serde_json::to_vec(&json!({})).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        JOIN_FEE,
    ));
}

fn default_metadata() -> Metadata {
    Metadata {
        project_link: Some("Some link".to_string()),
        twitter_link: None,
        medium_link: None,
        telegram_link: None,
    }
}

#[test]
fn basic_test() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(&owner, &auction_contract, None, None, None, None);

    join(&bob);
    bid(&bob, 1);

    join(&alice);
    bid(&alice, 2);

    let winner = root
        .view(
            contract_id(),
            "get_winner",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<String>();

    assert_eq!(winner, "alice", "ERR_WRONG_WINNER");

    let winner = root
        .view(
            contract_id(),
            "get_auction_account",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64, "account_id": alice_id()})).unwrap(),
        )
        .unwrap_json::<AuctionAccount>();

    assert_eq!(winner.amount.0, in_decimal(2), "ERR_WRONG_WINNER");
}

#[test]
fn nft_does_not_exist() {
    let (_, auction_contract, _, _, owner, _, _) = init();

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 2;

    println!("start creating");
    let result = call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 100.to_string(),
            deposit_token_id: token_id(),
            buyout_price: None,
            start_date: U64(start_date),
            end_date: U64(start_date + ONE_SEC_IN_NS * 40),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    );
    println!("end creating");

    assert_failure(result, "ERR_NFT_DOES_NOT_EXIST");
}

#[test]
fn does_not_own_nft() {
    let (_, auction_contract, _, _, owner, _, _) = init();

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 2;

    let result = call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 1.to_string(),
            deposit_token_id: token_id(),
            buyout_price: Some(U128(20)),
            start_date: U64(start_date),
            end_date: U64(start_date + ONE_SEC_IN_NS * 20),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    );

    assert_failure(result, "ERR_CONTRACT_DOES_NOT_OWN_THE_NFT");
}

#[test]
fn wrong_start_date() {
    let (_, auction_contract, _, _, owner, _, _) = init();

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 2;

    let result = call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: token_id(),
            buyout_price: Some(U128(20)),
            start_date: U64(1000),
            end_date: U64(start_date + ONE_SEC_IN_NS * 20),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    );
    assert_failure(result, "START_DATE_IS_TOO_SMALL");
}

#[test]
fn wrong_end_date() {
    let (_, auction_contract, _, _, owner, _, _) = init();

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 2;

    let result = call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: token_id(),
            buyout_price: Some(U128(20)),
            start_date: U64(start_date),
            end_date: U64(start_date),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    );

    assert_failure(result, "END_DATE_IS_TOO_SMALL");
}

#[test]
fn end_auction_by_buy_out() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(
        &owner,
        &auction_contract,
        Some(U128(in_decimal(10))),
        Some(U128(in_decimal(1))),
        None,
        None,
    );

    join(&bob);
    bid(&bob, 1);

    join(&alice);
    bid(&alice, 2);

    let result = bob.call(
        token_id(),
        "ft_transfer_call",
        &serde_json::to_vec(&json!({"receiver_id": contract_id(),
     "amount": U128(in_decimal(3)),
     "msg": "0",
     "memo":  3.to_string()}))
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "BID_MUST_CORRESPOND_ON_AUCTION_STEP");

    bid(&alice, 10);

    let result = bob.call(
        token_id(),
        "ft_transfer_call",
        &serde_json::to_vec(&json!({"receiver_id": contract_id(),
     "amount": U128(in_decimal(15)),
     "msg": "0",
     "memo":  15.to_string()}))
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "ERR_AUCTION_DONE");

    assert_all_success(bob.call(
        contract_id(),
        "claim_refund",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ));

    let winner = root
        .view(
            contract_id(),
            "get_winner",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<String>();

    assert_eq!(winner, "alice", "ERR_WRONG_WINNER");
}

#[test]
fn auction_with_fixed_step() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(
        &owner,
        &auction_contract,
        None,
        Some(U128(in_decimal(1))),
        None,
        None,
    );

    join(&bob);
    bid(&bob, 1);

    join(&alice);
    bid(&alice, 2);

    bid(&bob, 2);

    let result = alice.call(
        token_id(),
        "ft_transfer_call",
        &serde_json::to_vec(&json!({"receiver_id": contract_id(),
     "amount": U128(in_decimal(3)),
     "msg": "0",
     "memo":  3.to_string()}))
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "BID_MUST_CORRESPOND_ON_AUCTION_STEP");

    let winner = root
        .view(
            contract_id(),
            "get_winner",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<String>();

    assert_eq!(winner, "bob", "ERR_WRONG_WINNER");
}

#[test]
fn auction_with_min_step() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(
        &owner,
        &auction_contract,
        None,
        None,
        Some(U128(in_decimal(2))),
        None,
    );

    join(&bob);
    bid(&bob, 2);

    join(&alice);
    bid(&alice, 4);

    bid(&bob, 4);

    let result = alice.call(
        token_id(),
        "ft_transfer_call",
        &serde_json::to_vec(&json!({"receiver_id": contract_id(),
     "amount": U128(in_decimal(3)),
     "msg": "0",
     "memo":  3.to_string()}))
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "BID_MUST_BE_GREATER_ON_MIN_STEP");

    let winner = root
        .view(
            contract_id(),
            "get_winner",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<String>();

    assert_eq!(winner, "bob", "ERR_WRONG_WINNER");
}

#[test]
fn test_auction_done() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(&owner, &auction_contract, None, None, None, None);

    join(&bob);
    bid(&bob, 1);

    join(&alice);
    bid(&alice, 2);

    assert!(root.borrow_runtime_mut().produce_blocks(40).is_ok());

    let result = bob.call(
        token_id(),
        "ft_transfer_call",
        &serde_json::to_vec(&json!({"receiver_id": contract_id(),
     "amount": U128(in_decimal(2)),
     "msg": "0",
     "memo":  2.to_string()}))
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "ERR_AUCTION_DONE");

    let winner = root
        .view(
            contract_id(),
            "get_winner",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<String>();

    assert_eq!(winner, "alice", "ERR_WRONG_WINNER");
}

#[test]
fn test_auction_with_added_time() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 2;
    let end_date = start_date + ONE_SEC_IN_NS * 50;

    assert_all_success(call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: token_id(),
            buyout_price: Some(U128(in_decimal(20))),
            start_date: U64(start_date),
            end_date: U64(end_date),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: Some(U64(ONE_SEC_IN_NS * 20)),
            metadata: default_metadata(),
        }),
        deposit = 0
    ));

    join(&bob);
    bid(&bob, 1);

    join(&alice);
    bid(&alice, 2);

    let auction_output = get_auction_output(&root);
    assert!(
        auction_output.end_date.0 == end_date,
        "ERR time was added mistankly"
    );

    assert!(root.borrow_runtime_mut().produce_blocks(20).is_ok());

    let mut new_end_date = end_date;

    for i in 0..5 {
        let acc = if i % 2 == 0 { &bob } else { &alice };
        bid(acc, 2);

        let auction_output = get_auction_output(&root);
        assert!(
            auction_output.end_date.0 != new_end_date,
            "ERR time wasn't added"
        );
        new_end_date = auction_output.end_date.0;
    }

    let winner = root
        .view(
            contract_id(),
            "get_winner",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<String>();

    assert_eq!(winner, "bob", "ERR_WRONG_WINNER");
}

#[test]
fn refund_tokens() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(&owner, &auction_contract, None, None, None, None);

    join(&bob);
    bid(&bob, 1);

    join(&alice);
    bid(&alice, 2);

    bid(&bob, 2);
    bid(&alice, 2);

    assert!(root.borrow_runtime_mut().produce_blocks(60).is_ok());

    let mut balance_bob = root
        .view(
            token_id(),
            "ft_balance_of",
            &serde_json::to_vec(&json!({ "account_id": "bob" })).unwrap(),
        )
        .unwrap_json::<U128>();

    assert_eq!(balance_bob.0, in_decimal(97), "Err_balance");

    assert_all_success(bob.call(
        contract_id(),
        "claim_refund",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ));

    let result = bob.call(
        contract_id(),
        "claim_refund",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    );
    assert_failure(result, "ERR_ALREADY_REFUNDED");

    balance_bob = root
        .view(
            token_id(),
            "ft_balance_of",
            &serde_json::to_vec(&json!({ "account_id": "bob" })).unwrap(),
        )
        .unwrap_json::<U128>();

    assert_eq!(balance_bob.0, in_decimal(100), "Err_balance");
}

#[test]
fn test_claim_nft() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(&owner, &auction_contract, None, None, None, None);

    join(&bob);
    bid(&bob, 1);

    join(&alice);
    bid(&alice, 2);

    assert!(root.borrow_runtime_mut().produce_blocks(20).is_ok());

    let result = bob.call(
        contract_id(),
        "claim_nft",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "ERR_ONLY_WINNER_CAN_CLAIM_PURCHASE");

    assert_all_success(alice.call(
        contract_id(),
        "claim_nft",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    ));

    let nft = root
        .view(
            nft_id(),
            "nft_token",
            &serde_json::to_vec(&json!({ "token_id": "0" })).unwrap(),
        )
        .unwrap_json::<Token>();

    assert_eq!(nft.owner_id, alice_id(), "NFT_NOT_CLAIMED");

    let result = bob.call(
        contract_id(),
        "claim_nft",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );
    assert_failure(result, "ERR_NFT_ALREADY_CLAIMED");

    let auction_output = get_auction_output(&root);
    assert!(auction_output.nft_claimed, "ERROR_NFT_NOT_CLAIMED");

    assert_all_success(alice.call(
        nft_id(),
        "nft_transfer",
        &serde_json::to_vec(&json!({ "token_id": "0", "receiver_id": contract_id(), "msg": "nft_transfer_ownership" })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    ));

    create_auction(&owner, &auction_contract, None, None, None, None);

    assert_all_success(
        alice.call(
            token_id(),
            "ft_transfer_call",
            &serde_json::to_vec(&json!({"receiver_id": contract_id(),
            "amount": U128(in_decimal(1) ),
            "msg": "1",
            "memo":  "1"}))
            .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            1,
        ),
    );

    assert_all_success(
        bob.call(
            token_id(),
            "ft_transfer_call",
            &serde_json::to_vec(&json!({"receiver_id": contract_id(),
            "amount": U128(in_decimal(2) ),
            "msg": "1",
            "memo":  "2"}))
            .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            1,
        ),
    );

    assert!(root.borrow_runtime_mut().produce_blocks(40).is_ok());

    let result = alice.call(
        contract_id(),
        "claim_nft",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "ERR_NFT_ALREADY_CLAIMED");
}

#[test]
fn remove_auction() {
    let (_, auction_contract, bob, alice, owner, _, _) = init();

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 15;

    assert_all_success(call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: token_id(),
            buyout_price: Some(U128(20)),
            start_date: U64(start_date),
            end_date: U64(start_date + ONE_SEC_IN_NS * 20),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    ));

    join(&bob);
    join(&alice);

    assert_all_success(owner.call(
        contract_id(),
        "remove_auction",
        &json!({ "auction_id": 0_u64 }).to_string().into_bytes(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ));

    let result = call!(owner, auction_contract.get_auction(0), deposit = 0);
    assert_failure(result, "ERR_NO_AUCTION");
}

#[test]
fn remove_auction_failure() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(&owner, &auction_contract, None, None, None, None);

    join(&bob);

    join(&alice);

    assert!(root.borrow_runtime_mut().produce_blocks(60).is_ok());

    let result = owner.call(
        contract_id(),
        "remove_auction",
        &json!({ "auction_id": 0_u64 }).to_string().into_bytes(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    );

    assert_failure(result, "ERR_REMOVE_STARTED_AUCTION");
}

#[test]
fn test_n_users() {
    const USERS: u128 = 100;

    let (root, auction_contract, _, _, owner, _, _) = init();

    let storage = auction_contract
        .user_account
        .account()
        .unwrap()
        .storage_usage;

    println!("storage before create auction  {}", storage);

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 10;

    assert_all_success(call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: token_id(),
            buyout_price: None,
            start_date: U64(start_date),
            end_date: U64(start_date + ONE_SEC_IN_NS * 3000000),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    ));

    let storage_before = auction_contract
        .user_account
        .account()
        .unwrap()
        .storage_usage;

    let mut counter = 0;
    for i in 0..USERS {
        let acc = AccountId::new_unchecked(format!("acc{}", i));
        let user_acc = root.create_user(acc.clone(), to_yocto("10"));
        user_acc.call(
            token_id(),
            "storage_deposit",
            &serde_json::to_vec(&json!({"account_id":acc.clone(),})).unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            to_yocto("0.00125"),
        );
        owner.call(
            token_id(),
            "ft_transfer",
            &serde_json::to_vec(
                &json!({"receiver_id": acc, "amount": in_decimal(100).to_string()}),
            )
            .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            1,
        );
        call!(user_acc, auction_contract.join(), deposit = JOIN_FEE);
        let amount = in_decimal(1) + i * 1000000;
        user_acc.call(
            token_id(),
            "ft_transfer_call",
            &serde_json::to_vec(&json!({"receiver_id": contract_id(),
             "amount": U128(amount),
             "msg": "0",
             "memo":  (amount).to_string()}))
            .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            1,
        );

        counter += 1;
    }

    let storage = auction_contract
        .user_account
        .account()
        .unwrap()
        .storage_usage;

    println!("Experiment on {} users", counter);
    println!("storage after create auction {}", storage_before);

    println!("storage after auction done {}", storage);

    let winner = root
        .view(
            contract_id(),
            "get_winner",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<AccountId>();

    assert_eq!(
        winner,
        AccountId::new_unchecked(format!("acc{}", USERS - 1)),
        "ERR_WRONG_WINNER"
    );
}

#[test]
fn test_get_num_bids() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(
        &owner,
        &auction_contract,
        None,
        None,
        Some(U128(in_decimal(2))),
        None,
    );

    join(&bob);
    bid(&bob, 2);

    join(&alice);
    bid(&alice, 4);

    bid(&bob, 4);

    let accounts = root
        .view(
            contract_id(),
            "get_auctions_accounts",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<u64>();

    assert_eq!(accounts, 2, "ERR_WRONG_NUM_BIDS");

    let result = call!(
        owner,
        auction_contract.get_auctions_accounts(1),
        deposit = 0
    );

    assert_failure(result, "ERR_NO_AUCTION");
}

#[test]
fn test_get_num_users() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(
        &owner,
        &auction_contract,
        None,
        None,
        Some(U128(in_decimal(2))),
        None,
    );

    join(&bob);
    bid(&bob, 2);

    join(&alice);
    bid(&alice, 4);

    bid(&bob, 4);

    let accounts = root
        .view(
            contract_id(),
            "get_num_accounts",
            &serde_json::to_vec(&json!({})).unwrap(),
        )
        .unwrap_json::<u64>();

    assert_eq!(accounts, 3, "ERR_WRONG_NUM_USERS");
}

#[test]
fn test_rollback_tokens() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(
        &owner,
        &auction_contract,
        Some(U128(in_decimal(10))),
        None,
        None,
        None,
    );

    join(&bob);
    bid(&bob, 1);

    join(&alice);
    bid(&alice, 10);

    let balance_bob_before_bid = root
        .view(
            token_id(),
            "ft_balance_of",
            &serde_json::to_vec(&json!({ "account_id": "bob" })).unwrap(),
        )
        .unwrap_json::<U128>();

    bob.call(
        token_id(),
        "ft_transfer_call",
        &serde_json::to_vec(&json!({"receiver_id": contract_id(),
         "amount": U128(in_decimal(5) ),
         "msg": "0",
         "memo":  "5".to_string()}))
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    let balance_bob = root
        .view(
            token_id(),
            "ft_balance_of",
            &serde_json::to_vec(&json!({ "account_id": "bob" })).unwrap(),
        )
        .unwrap_json::<U128>();

    assert_eq!(balance_bob, balance_bob_before_bid, "Err_balance");
}

#[test]
fn test_get_account() {
    let (root, auction_contract, bob, _, owner, _, _) = init();

    create_auction(&owner, &auction_contract, None, None, None, None);

    let has_account = root
        .view(
            contract_id(),
            "has_account",
            &serde_json::to_vec(&json!({ "account_id": "bob" })).unwrap(),
        )
        .unwrap_json::<bool>();

    assert!(!has_account, "ERR_ACCOUNT_JOINED_MISTAKENLY");

    join(&bob);
    bid(&bob, 1);

    let response = root
        .view(
            contract_id(),
            "has_account",
            &serde_json::to_vec(&json!({ "account_id": "bob" })).unwrap(),
        )
        .unwrap_json::<bool>();

    assert_eq!(response, true, "ERR_ACCOUNT_NOT_JOINED");
}

#[test]
fn test_not_joined() {
    let (_, auction_contract, bob, _, owner, _, _) = init();

    create_auction(&owner, &auction_contract, None, None, None, None);

    let result = bob.call(
        token_id(),
        "ft_transfer_call",
        &serde_json::to_vec(&json!({"receiver_id": contract_id(),
         "amount": U128(5),
         "msg": "0",
         "memo":  (5).to_string()}))
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "ERR_NOT_REGISTERED_ACCOUNT");
}

#[test]
fn one_nft_many_auctions() {
    let (_, auction_contract, _, _, owner, _, _) = init();

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 20;

    assert_all_success(call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: token_id(),
            buyout_price: Some(U128(20)),
            start_date: U64(start_date),
            end_date: U64(start_date + ONE_SEC_IN_NS * 20),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    ));

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 2;

    let result = call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: token_id(),
            buyout_price: Some(U128(20)),
            start_date: U64(start_date),
            end_date: U64(start_date + ONE_SEC_IN_NS * 20),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    );
    assert_failure(result, "NFT_IS_ALREADY_ON_SALE");

    assert_all_success(owner.call(
        contract_id(),
        "remove_auction",
        &json!({ "auction_id": 0_u64 }).to_string().into_bytes(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ));

    create_auction(&owner, &auction_contract, None, None, None, None);
}

#[test]
fn test_aml_fields() {
    let (root, _, _, _, owner, _, _) = init();

    owner
        .call(
            contract_id(),
            "update_aml_account_id",
            &serde_json::to_vec(&json!({ "aml_account_id": aml_id() })).unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            0,
        )
        .assert_success();

    let result = owner.call(
        contract_id(),
        "update_aml_category",
        &serde_json::to_vec(&json!({"category": "All", "accepted_risk_score": 15 as u8})).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    );
    assert_failure(result, "ERR_RISK_SCORE_IS_INVALID");

    owner
        .call(
            contract_id(),
            "update_aml_category",
            &serde_json::to_vec(&json!({"category": "All","accepted_risk_score": 3 as u8}))
                .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            0,
        )
        .assert_success();

    let result = root
        .view(
            contract_id(),
            "get_aml",
            &serde_json::to_vec(&json!({})).unwrap(),
        )
        .unwrap_json::<(AccountId, Vec<(String, u8)>)>();
    println!("{:?}", result);

    assert_eq!(
        result,
        (aml_id(), [("All".to_string(), 3)].to_vec()),
        "wrong aml info"
    );
}

#[test]
fn test_auction_with_aml() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    create_auction(&owner, &auction_contract, None, None, None, None);

    join(&bob);
    bid(&bob, 1);

    join(&alice);
    bid(&alice, 2);

    let bob_token_balance_initial = root
        .view(
            token_id(),
            "ft_balance_of",
            json!({ "account_id": "bob" })
                .to_string()
                .into_bytes()
                .as_ref(),
        )
        .unwrap_json::<U128>();
    println!("bob token balance{}", bob_token_balance_initial.0);

    owner
        .call(
            contract_id(),
            "update_aml_category",
            &serde_json::to_vec(&json!({"category": "Scam","accepted_risk_score": 3 as u8}))
                .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            0,
        )
        .assert_success();

    let result = bob.call(
        token_id(),
        "ft_transfer_call",
        &serde_json::to_vec(&json!({"receiver_id": contract_id(),
         "amount": U128(in_decimal(2)),
         "msg": "0",
         "memo":  2.to_string()}))
        .unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "AML_NOT_ALLOWED");

    let bob_token_balance = root
        .view(
            token_id(),
            "ft_balance_of",
            json!({ "account_id": "bob" })
                .to_string()
                .into_bytes()
                .as_ref(),
        )
        .unwrap_json::<U128>();

    assert_eq!(
        bob_token_balance.0, bob_token_balance_initial.0,
        "ERR_WRONG_BOB_BALANCE"
    );

    let winner = root
        .view(
            contract_id(),
            "get_winner",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<String>();

    assert_eq!(winner, "alice", "ERR_WRONG_WINNER");
}

#[test]
fn test_auction_with_aml_near() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 2;

    assert_all_success(call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: near_id(),
            buyout_price: Some(U128(to_yocto("20"))),
            start_date: U64(start_date),
            end_date: U64(start_date + ONE_SEC_IN_NS * 40),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    ));

    join(&bob);
    assert_all_success(deposit_near(&bob, 1));

    join(&alice);
    assert_all_success(deposit_near(&alice, 2));

    owner
        .call(
            contract_id(),
            "update_aml_category",
            &serde_json::to_vec(&json!({"category": "Scam","accepted_risk_score": 3 as u8}))
                .unwrap(),
            near_sdk_sim::DEFAULT_GAS,
            0,
        )
        .assert_success();

    assert_failure(deposit_near(&bob, 2), "AML_NOT_ALLOWED");

    let bob_near_balance = root.borrow_runtime().view_account("bob").unwrap().amount;
    assert!(bob_near_balance > to_yocto("8.9"), "ERR_WRONG_BOB_BALANCE");

    let winner = root
        .view(
            contract_id(),
            "get_winner",
            &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        )
        .unwrap_json::<String>();

    assert_eq!(winner, "alice", "ERR_WRONG_WINNER");

    assert!(root.borrow_runtime_mut().produce_blocks(40).is_ok());

    assert_all_success(bob.call(
        contract_id(),
        "claim_refund",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ));

    let bob_near_balance = root.borrow_runtime().view_account("bob").unwrap().amount;
    assert!(bob_near_balance > to_yocto("9.9"), "ERR_WRONG_BOB_BALANCE");
}

#[test]
fn test_auction_with_near() {
    let (root, auction_contract, bob, alice, owner, _, _) = init();

    let start_date = owner.borrow_runtime().cur_block.block_timestamp + ONE_SEC_IN_NS * 2;

    assert_all_success(call!(
        owner,
        auction_contract.create_auction(AuctionInput {
            nft_contract_id: nft_id(),
            nft_token_id: 0.to_string(),
            deposit_token_id: near_id(),
            buyout_price: Some(U128(to_yocto("20"))),
            start_date: U64(start_date),
            end_date: U64(start_date + ONE_SEC_IN_NS * 40),
            initial_price: U128(0),
            auction_step: None,
            auction_min_step: None,
            added_time: None,
            metadata: default_metadata(),
        }),
        deposit = 0
    ));

    join(&bob);
    assert_all_success(deposit_near(&bob, 1));

    join(&alice);
    assert_all_success(deposit_near(&alice, 2));

    assert_all_success(deposit_near(&bob, 2));
    assert_all_success(deposit_near(&alice, 2));

    assert!(root.borrow_runtime_mut().produce_blocks(20).is_ok());

    // Claim NFT part

    let result = bob.call(
        contract_id(),
        "claim_nft",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    );

    assert_failure(result, "ERR_ONLY_WINNER_CAN_CLAIM_PURCHASE");

    assert_all_success(alice.call(
        contract_id(),
        "claim_nft",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        1,
    ));

    let nft = root
        .view(
            nft_id(),
            "nft_token",
            &serde_json::to_vec(&json!({ "token_id": "0" })).unwrap(),
        )
        .unwrap_json::<Token>();

    assert_eq!(nft.owner_id, alice_id(), "NFT_NOT_CLAIMED");

    let auction_output = get_auction_output(&root);
    assert!(auction_output.nft_claimed, "ERROR_NFT_NOT_CLAIMED");

    // Refund part

    assert_all_success(bob.call(
        contract_id(),
        "claim_refund",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ));

    let result = bob.call(
        contract_id(),
        "claim_refund",
        &serde_json::to_vec(&json!({ "auction_id": 0_u64 })).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    );
    assert_failure(result, "ERR_ALREADY_REFUNDED");

    let bob_near_balance = root.borrow_runtime().view_account("bob").unwrap().amount;
    assert!(bob_near_balance > to_yocto("9.9"), "ERR_WRONG_BOB_BALANCE");
}

#[test]
fn test_update_metadata() {
    let (_root, auction_contract, _bob, alice, owner, _, _) = init();

    create_auction(&owner, &auction_contract, None, None, None, None);

    assert_failure(alice.call(
        contract_id(),
        "update_metadata",
        &serde_json::to_vec(&json!({"auction_id": 0_u64, "metadata": {"project_link":"project_link", "twitter_link": "twitter_link", "medium_link": "medium_link"}})).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ), "ERR_MUST_BE_OWNER");

    assert_all_success(owner.call(
        contract_id(),
        "update_metadata",
        &serde_json::to_vec(&json!({"auction_id": 0_u64, "metadata": {"project_link":"project_link", "twitter_link": "twitter_link", "medium_link": "medium_link"}})).unwrap(),
        near_sdk_sim::DEFAULT_GAS,
        0,
    ));

    let output = get_auction_output(&alice);
    let metadata = Metadata {
        project_link: Some("project_link".to_string()),
        twitter_link: Some("twitter_link".to_string()),
        medium_link: Some("medium_link".to_string()),
        telegram_link: None,
    };

    assert_eq!(output.metadata, metadata, "ERR_WRONG_METADATA");

}