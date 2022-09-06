# HAPI Auction contract

## CLI installation

You can install cli via this [tutorial](https://docs.near.org/docs/tools/near-cli#installation)

> ## Notes about *added_time* logic
> Time adds to end_date if:
> - *added_time* field not empty
> - time to end of auction (end_time) less then *added_time*
> 
> Time adds to last bid time.
>>
>>Example:
>>
>> *added_time* = 30 sec
>>
>> *end_time* = 4h 20m 00sec 4 apr 2022
>> 
>> user bid in 4h 15m 00sec 4 apr 2022, until the end of the auction 5 minutes,so no time will be added.
>>
>>user bid in 4h 19m 40sec 4 apr 2022, until the end of the auction 20 seconds, that is less than *added_time*, so time will be added and *end_time* will be 4h 21m 10sec 4 apr 2022. That is, plus *added_time*(30 seconds) from the last bid.

## Getting started

Create auction preparing process

Create constants
```bash
export NEAR_ENV=testnet
export OWNER_ID=owner.testnet
export CONTRACT_ID=auction.$OWNER_ID
export NFT_CONTRACT=nft.$OWNER_ID
export AML_ID=aml.$OWNER_ID
```

For creating the new account for deploying contract use next command 

```bash
near create-account $CONTRACT_ID --masterAccount $OWNER_ID --initialBalance 10
```

First of all - you will need to deploy the wasm file.
```bash
near deploy $CONTRACT_ID --wasmFile=contract/res/auction_release.wasm
```

1 Near = 1000000000000000000000000

## Useful commands:

1. NEW

Then initialize contract with command where OWNER_ID is your admin UI account. Make sure that join_feee is correct.

```bash
near call $CONTRACT_ID new '{"owner_id": "'$OWNER_ID'", "join_fee": "5000000000000000", "aml_account_id":"'$AML_ID'"}' --accountId $CONTRACT_ID
```
2. 

```bash
near call wrap.testnet storage_deposit '{"account_id": "'$CONTRACT_ID'","registration_only": true}' --account_id=$CONTRACT_ID --deposit 0.00125
```


CREATE AUCTION

Here you can take a time for creating auction https://currentmillis.com.
Add 000000 to the time for recieving time in nanoseconds.
```bash
near call $CONTRACT_ID create_auction '{"auction":{
"nft_contract_id":"'$NFT_CONTRACT'",
"nft_token_id":"5",
"deposit_token_id":"wrap.testnet",
"start_date":"1644327900000000000",
"end_date":"1644328800000000000",
"auction_step":"1000000000000000000000000", 
"initial_price": "0",
"added_time": "300000",
"auction_min_step": "1000000000000000000000000",
"buyout_price":"15000000000000000000000000",
"metadata": {}
}}' --accountId $OWNER_ID --gas=41000000000000
```

JOIN FOR PARTECIPATE
```bash
near call $CONTRACT_ID join  --accountId $OWNER_ID --deposit 0.000000005
```

PARTICIPATE IN THE AUCTION
```bash
near call $CONTRACT_ID deposit_near '{"auction_id": 4
}' --accountId $OWNER_ID --deposit 1 --gas=80000000000000
```

GET WINNER
```bash
near view $CONTRACT_ID get_winner '{"auction_id": 4}'
```

GET ACUTION ACCOUNT INFO
```bash
near view $CONTRACT_ID get_auction_account '
{"auction_id": 4,"account_id": "'$OWNER_ID'"}' --accountId $OWNER_ID 
```

GET AUCTION INFO
```bash
near view $CONTRACT_ID get_auction '{"auction_id": 2}'
```

REMOVE AUCTION
```bash
near call $CONTRACT_ID remove_auction '{"auction_id": 0}' --accountId $OWNER_ID
```

CHANGE JOIN FEE
```bash
near call $CONTRACT_ID change_join_fee '{"join_fee": 1500}' --accountId $OWNER_ID
```

GET JOIN FEE
```bash
near view $CONTRACT_ID get_join_fee
```

UPDATE DATES
```bash
near call $CONTRACT_ID update_auction_dates '{"auction_id":4, "start_date":"1643634600000000000", "end_date":"1643642100000000000"}' --accountId $OWNER_ID
```

CLAIM REFUND
```bash
near call $CONTRACT_ID claim_refund '{"auction_id": 4}' --accountId $OWNER_ID --gas=60000000000000
```

CLAIM NFT
```bash
near call $CONTRACT_ID claim_nft '{"auction_id": 0}' --accountId $OWNER_ID --gas=60000000000000 --depositYocto=1
```

UPDATE AUCTION REFUND AVAILABLE
```bash
near call $CONTRACT_ID update_auction_refund_available '{"auction_id": 0, "refund_available": true}' --accountId $OWNER_ID
```

UPDATE AUCTION CLAIM AVAILABLE
```bash
near call $CONTRACT_ID update_auction_claim_available '{"auction_id": 0, "claim_available": true}' --accountId $OWNER_ID
```

PARTECIPATE WITH ANOTHER TOKEN

In field "msg" write auction id.

```bash
near call token3.rkonoval.testnet ft_transfer_call '{"receiver_id": "'$CONTRACT_ID'", "amount": "100000000", "msg": "0", "memo": "1"}' --account_id $OWNER_ID --amount 0.000000000000000000000001 --gas=100000000000000
```

GET NUM BIDS FOR AUCTION

This method returns the number of people participating in the auction.

```bash
near view $CONTRACT_ID get_num_bids'{"auction_id": 0}'
```

GET NUM BIDS FOR AUCTION

This method returns the number of people joined to platform.

```bash
near view $CONTRACT_ID get_num_users 
```

UPDATE METADATA

NOTE! if you don't write some field it will rewrite it to None
```bash
near call $CONTRACT_ID update_metadata '{"auction_id": 0, "metadata": {"project_link":"project_link", "twitter_link": "twitter_link", "medium_link": "medium_link", "telegram_link": "telegram_link"}}' --accountId $OWNER_ID
```
