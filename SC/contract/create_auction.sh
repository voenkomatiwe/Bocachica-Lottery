#!/bin/bash

# Admin's settings

token_id=6
nft_contract_id=nft.testnet

initial_price="0"000000000000000000000000
buyout_price="150"000000000000000000000000
min_step="1"000000000000000000000000
fixed_step="1"000000000000000000000000

start_date="2022-06-07 13:00:00"
end_date="2022-06-07 13:30:00"

# help functions
start=$(date -juf '%Y-%m-%d %H:%M:%S' "${start_date}" +"%s")000000000
end=$(date -juf '%Y-%m-%d %H:%M:%S' "${end_date}" +"%s")000000000

# blockchain command
near call $CONTRACT_ID create_auction '{
    "auction":{
        "nft_contract_id":"'$nft_contract_id'",
        "nft_token_id":"'$token_id'",
        "deposit_token_id":"near",
        "buyout_price":"'$buyout_price'",
        "start_date":"'$start'",
        "end_date":"'$end'",
        "auction_min_step":"'$min_step'", 
        "initial_price": "'$initial_price'",
        "metadata":{}
        }
}' --accountId $OWNER_ID

# Optional parameters
# For adding them, just copy needed line in command

#    "auction_min_step":"'$min_step'",
#    "added_time": "300000",
#    "auction_step": "'$fixed_step'"
#    "buyout_price":"'$buyout_price'",
