# casperstats-backend

This project provide the REST api to interact with Casper blockchain

# Table of contents

- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Reference](#reference)
  - [Installation](#installation)
- [API](#API)
  - [Account](#Account)
    - [get-account](#get-account)
    - [get-transfers](#get-transfers)
    - [get-deploys](#get-deploys)
    - [get-rich-accounts](#get-rich-accounts)
    - [count-holders](#count-holders)
    - [get-rewards](#get-rewards)

  - [Chain](#Chain)
    - [get-block](#get-block)
    - [get-block-tranfers](#get-block-tranfers)
    - [get-state-root-hash](#get-state-root-hash)
    - [get-latest-blocks](#get-latest-blocks)
    - [get-block-transfers](#get-block-transfer)
    - [get-block-deploy](#get-block-deploy)
    - [get-range-block](#get-range-block)
    - [get-latest-tx](#get-latest-tx)
    - [get-proposer-blocks](#get-proposer-blocks)

  - [Info](#Info)
    - [get-deploy](#get-deploy)
    - [get-list-deploys](#get-list-deploys)
    - [get-type](#get-type)
    - [get-circulating-supply](#get-circulating-supply)
    - [get-volume](#get-volume)
    - [get-transfer-volume](#get-transfer-volume)
    - [get-stats](#get-stats)
    - [economics](#economics)
 
  - [State](#State)
    - [query-state](#query-state)
    - [get-balance](#get-balance)
    - [get-auction-info](#get-auction-info)
    - [get-validators](#get-validators)
    - [get-validator](#get-validator)
    - [get-era-validators](#get-era-validators)
    - [get-bids](#get-bids)

## Quick Start

### Requirements

OS: Unix

Development environment: NodeJs


### Reference
- [casper-client](https://crates.io/crates/casper-client)
- [casper-rpc-api](http://casper-rpc-docs.s3-website-us-east-1.amazonaws.com/)
- [casper-list-rpcs](https://github.com/cryptoviet/casper-document/blob/main/list-rpcs.json)


### Installation

- Run
```
$ git clone https://github.com/cryptoviet/casperstats-backend.git
$ cd casperstats-backend
$ npm i

$ npm start

Or deamon

$ npm run dev

```

## API

### Account


  #### get-account
  
  ```
url: /chain/get-account/:address

example: api.casperstats.io/account/get-account/0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c
method: GET

des:  Get information of the account

successResponse:
{
    "account_hash": "6ee862e976a99eed1c517bbf7f0d3e97f988f1cf12f3b8e347c033ac9ff745d2",
    "public_key_hex": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c",
    "balance": "2500000000",
    "active_date": "2021-05-04T00:59:39.930Z",
    "available": "2500000000",
    "total_staked": "62053395525340",
    "unbonding": "0",
    "total_reward": "627492029597747"
}
```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| account | string | public_key or account_hash | Yes |

  #### get-transfers
  
  ```
url: /chain/get-transfers/?account=&start=&count=

example: https://api.casperstats.io/account/get-transfers/?account=45f3aa6ce2a450dd5a4f2cc4cc9054aded66de6b6cfc4ad977e7251cf94b649b&start=2&count=5

method: GET

des:  Get number of transfers of account


successResponse:
[
    {
        "deploy_hash": "790777950dc169710ddbdba5c2a869e607719d26e11a724f147be2d6de52a7eb",
        "timestamp": "2021-05-19T15:20:38.456Z",
        "from_address": "45f3aa6ce2a450dd5a4f2cc4cc9054aded66de6b6cfc4ad977e7251cf94b649b",
        "to_address": "76bea7e9b3ba17b95f92eafebd22f3ca5ac1e5bd9441ebd9a86e6f040f0957d8",
        "value": "10000000000",
        "fee": "0",
        "from_balance": "156487207566812521",
        "to_balance": "0"
    },
    {
        "deploy_hash": "fb435e1f6c33f9901f2e4ee5ff24b93be801ef118296b4eebf99bbcebfa5e28e",
        "timestamp": "2021-05-19T15:08:32.692Z",
        "from_address": "45f3aa6ce2a450dd5a4f2cc4cc9054aded66de6b6cfc4ad977e7251cf94b649b",
        "to_address": "b3ba08f5246166a687d0a831126300b8788924bb40be9e528bd6071f739d2835",
        "value": "1679630146000",
        "fee": "0",
        "from_balance": "156487207566812521",
        "to_balance": "10"
    },
    {
        "deploy_hash": "0f04294860df18bc22145638051c2fafe397879f1c5f10e187a22e60ef2da498",
        "timestamp": "2021-05-19T15:04:44.171Z",
        "from_address": "45f3aa6ce2a450dd5a4f2cc4cc9054aded66de6b6cfc4ad977e7251cf94b649b",
        "to_address": "d712441908ea2233779eb4e6679e85f003f5b021be5833df30c219e5940765fc",
        "value": "1616666000000",
        "fee": "0",
        "from_balance": "156487207566812521",
        "to_balance": "990000"
    },
    {
        "deploy_hash": "28820df6fd37759ccd3d00b1cbcfde5eb0eeca81a7983cfc6769a3424cf8c199",
        "timestamp": "2021-05-19T14:52:40.829Z",
        "from_address": "45f3aa6ce2a450dd5a4f2cc4cc9054aded66de6b6cfc4ad977e7251cf94b649b",
        "to_address": "b3ba08f5246166a687d0a831126300b8788924bb40be9e528bd6071f739d2835",
        "value": "10000000000",
        "fee": "0",
        "from_balance": "156487207566812521",
        "to_balance": "10"
    },
    {
        "deploy_hash": "9b0717b63a9860892bbd3a0dfffc5e258e2d0524399857d9c3663ad6aa19f039",
        "timestamp": "2021-05-19T14:48:43.418Z",
        "from_address": "45f3aa6ce2a450dd5a4f2cc4cc9054aded66de6b6cfc4ad977e7251cf94b649b",
        "to_address": "345adf2bfc9fefb5e35657b9c2c4a2f4d1e77dbdd49b993623c0b4f2ecb6ca46",
        "value": "2463336567666",
        "fee": "0",
        "from_balance": "156487207566812521",
        "to_balance": "990000"
    }
]
```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| account | string | public_key or account_hash | Yes |
| start | number | start tranfers | Yes |
| count | number | number of transfers will be return | Yes |


  #### get-deploys
  
  ```
url: /chain/get-deploys/:account

example: https://api.casperstats.io/account/get-deploys/?account=02029d865f743f9a67c82c84d443cbd8187bc4a08ca7b4c985f0caca1a4ee98b1f4c&start=1&count=2

method: GET

des:  Get number of deploys of an account

successResponse:
[
    {
        "deploy_hash": "171a4e298ebf00fc5bfd6d1006e6df63d17919ab80c3e0ae45a80c4b6a84d88f",
        "hash": "e3f12e712f25c3ba0b7ba736fd1b3bfb5c96346df8066fa368f3be93977344aa",
        "timestamp": "2021-05-18T23:08:28.867Z",
        "public_key": "02029d865f743f9a67c82c84d443cbd8187bc4a08ca7b4c985f0caca1a4ee98b1f4c",
        "gas_price": 1,
        "cost": "10000",
        "status": "success"
    },
    {
        "deploy_hash": "fbf042dc29aaac1e6b510a3351d87ce246ed92dd8e1bf65755ae80c0a7a65d89",
        "hash": "6eebec482a7d66cd1f7d986bd48bda0d75a46d4c99f9dc4d7c37ab1e2dc35ca1",
        "timestamp": "2021-05-18T23:16:20.399Z",
        "public_key": "02029d865f743f9a67c82c84d443cbd8187bc4a08ca7b4c985f0caca1a4ee98b1f4c",
        "gas_price": 1,
        "cost": "10000",
        "status": "success"
    }
]
```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| account | string | public_key or account_hash | Yes |
| start | number | start index | Yes |
| count | number | number of deploys will be return | Yes |


 #### get-rich-accounts
  
  ```
url: /account/get-rich-accounts/?start=&count=

example: https://api.casperstats.io/account/get-rich-accounts/?start=0&count=10

method: GET

des:  Get number of deploys of an account

successResponse:
[
    {
        "account_hash": "8c15bba2d147859c7b7a8f43028eeb4d3c9571c6e36dfecc97c77463d3af08cd",
        "public_key_hex": "02024c5e3ba7b1da49cda950319aec914cd3c720fbec3dcf25aa4add631e28f70aa9",
        "balance": "1663678757999890000",
        "active_date": "2021-06-23T16:21:39.967Z",
        "transferrable": "1663678757999890000",
        "staked_amount": "0"
    },
    {
        "account_hash": "b8e119b446f65536e4cc213fba4a0e38533007ae5dea52c4618a86647ccc873a",
        "public_key_hex": "02035c47ccbeaa32040d6904b6dc163c3b546314c52b2a78583835f54a224ab365a4",
        "balance": "1000000002000000000",
        "active_date": "2021-05-06T15:12:27.259Z",
        "transferrable": "1000000002000000000",
        "staked_amount": "0"
    },
    {
        "account_hash": "762a3cc23b3b46b42bce1b503ff6b45e9c8762ffb0292a09600c5adcb9bff578",
        "public_key_hex": "02036210c108f7e819a38ae05cc7b1dc39a2e6366f1404ce4c12e9c05b3832d811bb",
        "balance": "800000002000000000",
        "active_date": "2021-05-06T15:12:27.385Z",
        "transferrable": "800000002000000000",
        "staked_amount": "0"
    },
    {
        "account_hash": "4a19db8df0a8336ec41e19e0a36e89edc40b7c8940b05c2f5e5e7015aa51ad78",
        "public_key_hex": "0202bb1cdbec959d918875610aece2cd043ed8f1ed42461215812c5328592c7f4f58",
        "balance": "486858336999970000",
        "active_date": "2021-05-10T20:54:36.955Z",
        "transferrable": "486858336999970000",
        "staked_amount": "0"
    },
    {
        "account_hash": "6ba745068f8d504783f682a90f07874160c3f061130d0dade51d911279d36359",
        "public_key_hex": "010b24b2974ac8dd9027a06be487c383732a5e4605d254fb017d9fce388d347e77",
        "balance": "453839647499990000",
        "active_date": "2021-06-21T13:39:10.202Z",
        "transferrable": "7499990000",
        "staked_amount": "453839640000000000"
    },
    {
        "account_hash": "e4642b00383352a598c3cfd37c803c0db577a3eabdef12cb0f3e362f51197373",
        "public_key_hex": "0193b5804d28a7e1b4db58c9a2300e65cac7ddf7388cd3f7dfca0fe4943feb2ebd",
        "balance": "313799273650349300",
        "active_date": "2021-06-24T00:41:12.758Z",
        "transferrable": "999937976",
        "staked_amount": "313799272650411300"
    },
    {
        "account_hash": "eb1cbc3db68fcb8ccdd303d92c38d8fd131e29b8876b65174348abc2e9328510",
        "public_key_hex": "0186b7ca898840f945fb148110f5637d209632c312f6dc2f68eb6bb363586e2b6d",
        "balance": "249269665013920000",
        "active_date": "2021-06-19T17:20:38.118Z",
        "transferrable": "249269665013920000",
        "staked_amount": "0"
    },
    {
        "account_hash": "94664ce59fa2e6eb0cc69d270fc91dd9dd2ba02a1f7964c69f036ef4a68bb96f",
        "public_key_hex": "01b92e36567350dd7b339d709bfe341df6fda853e85315418f1bb3ddd414d9f5be",
        "balance": "206084149994825200",
        "active_date": "2021-06-24T07:10:27.990Z",
        "transferrable": "206084149994825204",
        "staked_amount": "0"
    },
    {
        "account_hash": "36a53847967861e29a611465c56c3b23b46ee6b258dcb7d4f0e70327341bb11e",
        "public_key_hex": "020228782ebc6dc9fc2fd67f08bce741bdd4892ff0c616811bc0cfeff5daf5476bd1",
        "balance": "202271964375860000",
        "active_date": "2021-05-12T18:57:26.058Z",
        "transferrable": "202271964375860000",
        "staked_amount": "0"
    },
    {
        "account_hash": "45f3aa6ce2a450dd5a4f2cc4cc9054aded66de6b6cfc4ad977e7251cf94b649b",
        "public_key_hex": "02029d865f743f9a67c82c84d443cbd8187bc4a08ca7b4c985f0caca1a4ee98b1f4c",
        "balance": "116747841687568370",
        "active_date": "2021-06-24T04:10:31.189Z",
        "transferrable": "116747841687568372",
        "staked_amount": "0"
    }
]
```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| count | number | number of richest accounts| Yes |


 #### count-holders
  
  ```
url: /account/count-holders

example: https://api.casperstats.io/account/count-holders

method: GET

des:  Get number of holders

successResponse:
{
    "number_of_holders": 208
}
```

#### get-rewards
  
  ```
url: /account/get-rewards?account=&start=&count=

example: api.casperstats.io/account/get-rewards?account=0107c39ec309b16b2e9244f661c711b817659f3a48cbf7f602181ea13a9e4ce3ba&start=0&count=5

method: GET

des:  Get number of deploys of an account

successResponse:
[
    {
        "date": "2021-06-12",
        "validator": "0107c39ec309b16b2e9244f661c711b817659f3a48cbf7f602181ea13a9e4ce3ba",
        "rewards": "38665966",
    },
    {
        "date": "2021-06-11",
        "validator": "0107c39ec309b16b2e9244f661c711b817659f3a48cbf7f602181ea13a9e4ce3ba",
        "rewards": "92468051",
    },
    {
        "date": "2021-06-10",
        "validator": "0107c39ec309b16b2e9244f661c711b817659f3a48cbf7f602181ea13a9e4ce3ba",
        "rewards": "4654629",
    },
    {
        "date": "2021-06-09",
        "validator": "0107c39ec309b16b2e9244f661c711b817659f3a48cbf7f602181ea13a9e4ce3ba",
        "rewards": "4659278",
    },
    {
        "date": "2021-06-08",
        "validator": "0107c39ec309b16b2e9244f661c711b817659f3a48cbf7f602181ea13a9e4ce3ba",
        "rewards": "4674328",
    }
]
```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| account | string | account| Yes |
| start | number | start from today| Yes |
| count | number | number of day | Yes |



### Chain

   #### get-block
  
  ```
url: /chain/get-block/:block

example: https://api.casperstats.io/chain/get-block/69

method: GET

des:  Retrieves a block from the network

successResponse:
{
    "jsonrpc": "2.0",
    "id": 1620891792263,
    "result": {
        "api_version": "1.1.0",
        "block": {
            "hash": "6f4e4e38149aff143f7ac387c32f11f018a5948b8c95ff0dec5bbc43c81970a4",
            "header": {
                "parent_hash": "e3fb05552b6befc66038e652df18a2a158d26081df6a3c959e055664c885a005",
                "state_root_hash": "8e22e3983d5ca9bcf9804bd3a6724b8c24effdf317a1d9c05175125a1bf8b679",
                "body_hash": "6da90c09f3fc4559d27b9fff59ab2453be5752260b07aec65e0e3a61734f656a",
                "random_bit": false,
                "accumulated_seed": "1fb111212833beb7b4da83aabd86413f73c416a30a5395dd62f1f7f1dfd50b4f",
                "era_end": null,
                "timestamp": "2021-03-31T16:18:12.608Z",
                "era_id": 0,
                "height": 69,
                "protocol_version": "1.0.0"
            },
            "body": {
                "proposer": "012bac1d0ff9240ff0b7b06d555815640497861619ca12583ddef434885416e69b",
                "deploy_hashes": [],
                "transfer_hashes": []
            },
            "proofs": []
        },
        "current_height": 54674
    }
}
```

| Params  | Type | Description |
| ------------- | ------------- | ------------- |
| id | number | JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned |
| b | string, number |  Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |

#### get-block-tranfers

```
url: /chain/get-block-tranfers

example: https://api.casperstats.io/chain/get-block-transfers/54675

method: GET

des: Retrieves all transfers for a block from the network

successResponse:
[
    {
        "deploy_hash": "5bd8b351c7006304a146f06e28ed2afa0c8d3cb8a6c6f5a84151efe2c9380754",
        "from": "account-hash-45f3aa6ce2a450dd5a4f2cc4cc9054aded66de6b6cfc4ad977e7251cf94b649b",
        "to": "account-hash-bb26c304502f42be8cb835f4e6bf5e0415177f18a271b633b3e873c0d7b6d8d5",
        "source": "uref-6ad5075addcdef0308bf9100a88292fd16e49edeb724dea2cc9f6f3730352d97-007",
        "target": "uref-6e1511c197ef652c1df76714f0524d453beaf3416f8b61f81d2e598efc51c51d-004",
        "amount": "555999989000",
        "gas": "0",
        "id": null
    },
    {
        "deploy_hash": "e0c9a06a875af876a7b06d7753c69ed016195c1e03f03109a8487558a04938aa",
        "from": "account-hash-d30497d1ea0e69e78bf3d64534d5d626725191e1e3c671c7dc786e396708c01e",
        "to": "account-hash-94664ce59fa2e6eb0cc69d270fc91dd9dd2ba02a1f7964c69f036ef4a68bb96f",
        "source": "uref-3d820f152f425f4b0cf383b6101a6fa66df698f4122e4494cae98b78a635a3db-007",
        "target": "uref-4c61453f1bdf1f3c4b20b47b2fcfedabcc9e3afb29f8bb5983b7184e6a4497e5-004",
        "amount": "3526338200000",
        "gas": "0",
        "id": 1620891788087
    },
    {
        "deploy_hash": "27ed2584ae4e2d0934c57ea2b6c99bdd8c07b0ad6be946eb6e02bf4da304cd3f",
        "from": "account-hash-16afaa760371acbeddc5c37ef2497207ec7c0e83eef5bd878cc09ff367cf276b",
        "to": "account-hash-288797af5b4eeb5d4f36bd228b2e6479a77a27e808597ced1a7d6afe4c29febc",
        "source": "uref-002d1339c4226b598b7dce159e6037f8518ecf1b892db82242cacb61f5e821a5-007",
        "target": "uref-7a4ca4244548d2f5842267bb82ed5b9b24c57ec1c1b7602354985e01840196b1-004",
        "amount": "576828265000",
        "gas": "0",
        "id": null
    },
    {
        "deploy_hash": "994756cc71a93a75b0141bd48ea6eb496abc109e330f74e7f4cfacae2911806a",
        "from": "account-hash-fa8489d61672b3a38ec14a480e99c6337b19ae2df3da42b6c3946e97d3e20f27",
        "to": "account-hash-288797af5b4eeb5d4f36bd228b2e6479a77a27e808597ced1a7d6afe4c29febc",
        "source": "uref-7f4c87cef0d8caab3a45f0005b752ac51b27f269a77f8bc0823e3385f8bebdcd-007",
        "target": "uref-7a4ca4244548d2f5842267bb82ed5b9b24c57ec1c1b7602354985e01840196b1-004",
        "amount": "99999990000",
        "gas": "0",
        "id": null
    }
]
```

| Params  | Type | Description |
| ------------- | ------------- | ------------- |
| id | number | JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned |
| b | string, number |  Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


#### get-state-root-hash

```
url: /chain/get-state-root-hash/:block

example: https://api.casperstats.io/chain/get-state-root-hash/69

method: GET

des: Retrieves a state root hash at a given block

successResponse:
{
    "jsonrpc": "2.0",
    "id": 1620891967361,
    "result": {
        "api_version": "1.1.0",
        "state_root_hash": "8e22e3983d5ca9bcf9804bd3a6724b8c24effdf317a1d9c05175125a1bf8b679"
    }
}
```

| Params  | Type | Description |
| ------------- | ------------- | ------------- |
| id | number | JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned |
| b | string, number |  Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


#### get-latest-blocks

```
url: /chain/get-latest-block/:number

example: https://api.casperstats.io/chain/get-latest-blocks/3

method: GET

des: Get number of the latest block

successResponse: block data

```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| num | number | Number of last block you wanna get | Yes |


| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |

#### get-block-transfers

```
url: /chain/get-block-transfers/:block

example: https://api.casperstats.io/chain/get-block-transfers/11661

method: GET

des: get the information the transfer on the block

successResponse:
[
    {
        "amount": "98000000000",
        "deploy_hash": "db5f69c51ddacaeab0bee5c7e5665313489d99ffbbadd9208ff45092ee85476f",
        "from": "account-hash-5861c4bbab2992d44f035c6db5ffff925c40e50c10df564f0c896435807dac9f",
        "gas": "0",
        "id": null,
        "source": "uref-01eb60dabf2d4cf399561e874ed24c1556332ed0ae9b1064c125aa284aad5f39-007",
        "target": "uref-e81b4fffcd8fd5ff94bf22fb80667522504b23ec8e0a3d8db1ca0515b43b554f-004",
        "to": "account-hash-edb9b5d9590bb1d48bd13d178dc7cf3b385f10986754865441e0e957be20eaed"
    },
    {
        "amount": "98000000000",
        "deploy_hash": "4af6e98ae14f91e121ef925eb89e21719e80ca00e3bab255132f6a69e15ebd60",
        "from": "account-hash-6a9b128359f8429cb63d11a99862382bc7ef43ae5c550168f557e75a151f9e05",
        "gas": "0",
        "id": null,
        "source": "uref-b8f2e9b3fbd1dbd20c1e95b4566d5810c95de8faf387c34099f8413dc23e0f7a-007",
        "target": "uref-e81b4fffcd8fd5ff94bf22fb80667522504b23ec8e0a3d8db1ca0515b43b554f-004",
        "to": "account-hash-edb9b5d9590bb1d48bd13d178dc7cf3b385f10986754865441e0e957be20eaed"
    },
    {
        "amount": "98000000000",
        "deploy_hash": "18c5e7600669d0d141c082fac26a0fe6ef197bc7476d88198143f215fcd48db2",
        "from": "account-hash-036a53c38dd3eaa082b8f17c049e2092b0b9d8c75301f198409533c4a62cbe4f",
        "gas": "0",
        "id": null,
        "source": "uref-7d87c7e2677eec2414260e8d31d5302ee1ab0beef623e39b3cf3f00cb75c9265-007",
        "target": "uref-e81b4fffcd8fd5ff94bf22fb80667522504b23ec8e0a3d8db1ca0515b43b554f-004",
        "to": "account-hash-edb9b5d9590bb1d48bd13d178dc7cf3b385f10986754865441e0e957be20eaed"
    }
]

```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| b | string, number |  Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used | Optional |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


#### get-block-deploy

```
url: /chain/get-block-deploy/:block

example: https://api.casperstats.io/chain/get-block-deploy/54543

method: GET

des: get the information the deploy on the block

successResponse:
localhost:3031/chain/get-block-deploy/11661

```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| b | string, number |  Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used | Optional |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


#### get-range-block

```
url: /chain/get-range-block?start=&end=

example: https://api.casperstats.io/chain/get-range-block?start=1000&end=1005

method: GET

des: get blocks from the param 'start' to param 'end'. start and end included

successResponse:
{
    "current_height": 23062,
    "result": [
        {
            "hash": "d565bebe182e54e5d5efb5be247d64cd2c12bf9393948b85827c0a7a220a7f07",
            "header": {
                "parent_hash": "61b6f6cb0afcb6ff20ad7dca007e90eccc31717943c5fe1451a620c16985721f",
                "state_root_hash": "a11fbc52f7ace34fb3b84af0756462691af64f6e8ecf562171b8a61281dc1f00",
                "body_hash": "34eb0b689accd4867e88c765e623da2f63265dbbb99f16e3f369b5ae92c29ebd",
                "random_bit": false,
                "accumulated_seed": "c2912f64fd5212ee49117862239814d4f3bb3a7d2dee67a22413d565b45e92b6",
                "era_end": null,
                "timestamp": "2021-04-09T14:53:50.976Z",
                "era_id": 10,
                "height": 1000,
                "protocol_version": "1.0.0"
            },
            "body": {
                "proposer": "016adc82d5f8368829c9cd6088fdd39b46960dbf5a7f4fc18f498f5bc8637ec656",
                "deploy_hashes": [],
                "transfer_hashes": []
            },
            "proofs": []
        },
        {
            "hash": "4826178402f2bef782dcde494e075c46e5208643d497d28401520a395e293153",
            "header": {
                "parent_hash": "d565bebe182e54e5d5efb5be247d64cd2c12bf9393948b85827c0a7a220a7f07",
                "state_root_hash": "a11fbc52f7ace34fb3b84af0756462691af64f6e8ecf562171b8a61281dc1f00",
                "body_hash": "d39ebbfd8c20216acdf35b0c5954891578c1171e0e050abf68c1f3bded4ab6b7",
                "random_bit": true,
                "accumulated_seed": "f16a99903312a0d9c1f9a34d376b1090175927e908922bfdaed99539a7794286",
                "era_end": null,
                "timestamp": "2021-04-09T14:54:56.512Z",
                "era_id": 10,
                "height": 1001,
                "protocol_version": "1.0.0"
            },
            "body": {
                "proposer": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e",
                "deploy_hashes": [],
                "transfer_hashes": []
            },
            "proofs": []
        },
        {
            "hash": "afd17161bd6d4f33df51d7d8ac53fe54ba2abb140f87ff5a6a7d5010ee139fd2",
            "header": {
                "parent_hash": "4826178402f2bef782dcde494e075c46e5208643d497d28401520a395e293153",
                "state_root_hash": "a11fbc52f7ace34fb3b84af0756462691af64f6e8ecf562171b8a61281dc1f00",
                "body_hash": "aca3479f7a62d5707c1996264decc06d531f4cc1922f6fab2a2a52ff2add74c3",
                "random_bit": false,
                "accumulated_seed": "6d9769bd2267a5eae44e27fc894babbb4edfbde556eedd26546cfc46b4ae6d5e",
                "era_end": null,
                "timestamp": "2021-04-09T14:56:02.048Z",
                "era_id": 10,
                "height": 1002,
                "protocol_version": "1.0.0"
            },
            "body": {
                "proposer": "01b1e495b07045f098d04d729947d8efb6a471c7b5ba69b461c980a276f56957c1",
                "deploy_hashes": [],
                "transfer_hashes": []
            },
            "proofs": []
        },
        {
            "hash": "eb691fffae78ea72a1ec6fe7d3099e14463bd1b85f30e181c056ab67fe3c9ace",
            "header": {
                "parent_hash": "afd17161bd6d4f33df51d7d8ac53fe54ba2abb140f87ff5a6a7d5010ee139fd2",
                "state_root_hash": "a11fbc52f7ace34fb3b84af0756462691af64f6e8ecf562171b8a61281dc1f00",
                "body_hash": "bb9b255dc11611a00adffc7cf86b67cf443771f6036aff5660d8ead9f629266b",
                "random_bit": true,
                "accumulated_seed": "87ba53d0a0e5a826dd43c8373b283d18f59e5bbe6221df6df9de34d6ee92d835",
                "era_end": null,
                "timestamp": "2021-04-09T14:57:07.584Z",
                "era_id": 10,
                "height": 1003,
                "protocol_version": "1.0.0"
            },
            "body": {
                "proposer": "0124aa3964bcd0ba9911594322a534e18e36e0c2e149b148e615505316733599af",
                "deploy_hashes": [],
                "transfer_hashes": []
            },
            "proofs": []
        },
        {
            "hash": "dc74bfa062d52f04f9b0053a30f138753ed9070e0f6d1cb7aead7166980dd28b",
            "header": {
                "parent_hash": "eb691fffae78ea72a1ec6fe7d3099e14463bd1b85f30e181c056ab67fe3c9ace",
                "state_root_hash": "a11fbc52f7ace34fb3b84af0756462691af64f6e8ecf562171b8a61281dc1f00",
                "body_hash": "1086c5c5f3d04e3729fd9832e646a053d81b207ae9202af57a4f1d6a55c9303a",
                "random_bit": false,
                "accumulated_seed": "68a7bda3a32501e0e7371dbb6fa734b5ea52e02dac88302aee23f331bc857782",
                "era_end": null,
                "timestamp": "2021-04-09T14:58:13.120Z",
                "era_id": 10,
                "height": 1004,
                "protocol_version": "1.0.0"
            },
            "body": {
                "proposer": "0152b2b3cc1de020e0cfb5887d0fda5d99da5decaf98af90f13144e97d0e35eeaa",
                "deploy_hashes": [],
                "transfer_hashes": []
            },
            "proofs": []
        },
        {
            "hash": "ec47b54efdea57808bc20330191928e51e094da0f9460a35957f3ecd9894a081",
            "header": {
                "parent_hash": "dc74bfa062d52f04f9b0053a30f138753ed9070e0f6d1cb7aead7166980dd28b",
                "state_root_hash": "a11fbc52f7ace34fb3b84af0756462691af64f6e8ecf562171b8a61281dc1f00",
                "body_hash": "aca3479f7a62d5707c1996264decc06d531f4cc1922f6fab2a2a52ff2add74c3",
                "random_bit": false,
                "accumulated_seed": "b03942e0de46b649254e789b59b3ec8465e461b169412401290f2100ccf7ed75",
                "era_end": null,
                "timestamp": "2021-04-09T14:59:18.656Z",
                "era_id": 10,
                "height": 1005,
                "protocol_version": "1.0.0"
            },
            "body": {
                "proposer": "01b1e495b07045f098d04d729947d8efb6a471c7b5ba69b461c980a276f56957c1",
                "deploy_hashes": [],
                "transfer_hashes": []
            },
            "proofs": []
        }
    ]
}

```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| start | number | start | Yes |
| end | number, number |  end | Yes |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


#### get-latest-tx

```
url: /chain/get-latest-tx/

example: http://api.casperstats.io/chain/get-latest-txs?start=0&count=3

method: GET

des: get number of latest transaction

successResponse:
[
    {
        "deploy_hash": "19ecc72368b1bd2bb592e845a8639fd50fede5c5f8e69604e65e8f36a9518c1d",
        "timestamp": "2021-05-19T15:08:24.246Z",
        "from_address": "2eeb39fd238590c0b811fe6543ad845203cc8508eef9643ecaf03befbdf8f5e1",
        "to_address": "a616c7838d3d03fe0b45c07560ce413f23ccaf35247addc91d1cf7a788db2635",
        "value": "2361666000000",
        "fee": "0",
        "from_balance": "990000",
        "to_balance": "98288308498499960"
    },
    {
        "deploy_hash": "085edde280cd58808b9911dd80b9d8a44288b0f1745fdcd72eebcab63083d355",
        "timestamp": "2021-05-19T15:07:54.402Z",
        "from_address": "496d542527e1a29f576ab7c3f4c947bfcdc9b4145f75f6ec40e36089432d7351",
        "to_address": "af34713e99d8723a19280f623df1c7a8ced29bf74c4d1f13e77059c8c6844720",
        "value": "6149500000000",
        "fee": "0",
        "from_balance": "12947238920913706",
        "to_balance": "6149500990000"
    },
    {
        "deploy_hash": "52b79230e42ed50feae2ea9659ae83b4aa98da625bba801e790e9bebcb8c8121",
        "timestamp": "2021-05-19T15:07:19.363Z",
        "from_address": "496d542527e1a29f576ab7c3f4c947bfcdc9b4145f75f6ec40e36089432d7351",
        "to_address": "5aeccb60ac1dd7b83fb68a1c03df2f01040004ccf305873d442660922be29d02",
        "value": "3998800000000",
        "fee": "0",
        "from_balance": "12953388420923706",
        "to_balance": "1145973999999993"
    }
]

```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| start | number | start | Yes |
| end | number, number |  end | Yes |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


### get-proposer-blocks

```
url: /chain/get-proposer-blocks?validator=&start=&count=

example: https://api.casperstats.io/chain/get-proposer-blocks?validator=01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a&count=10&start=0

method: GET

des: get number of latest transaction

successResponse:
[
    {
        "hash": "bf5ae8994782dbc6ab47f6ca07b75c116153776ca128c606ac2971656c209f49",
        "height": 62804,
        "timestamp": "2021-05-19T13:30:25.664Z",
        "era": 586,
        "parent_hash": "88476fd5c89f65e502f5efe90f1e67d738136d508ae452ae2e1b267a0c893db4",
        "state_root_hash": "32fd0ede84634fc733c91c0dd2f4e9b43a4a5abb4a765cf78f5207e5edc46eb3",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    },
    {
        "hash": "533e51e8b55cda7d6ae5ea437565695e1d83aec602575e90583683a1ded5ad98",
        "height": 62794,
        "timestamp": "2021-05-19T13:19:30.304Z",
        "era": 586,
        "parent_hash": "c138a03119c68fb5207f6e6845f50bc4c0aced4943cc47dfff66ea57fc294ded",
        "state_root_hash": "bbd77c0d5b95db4ca72ac16b1b9e239786a2cf6f9f4ac356b7ed35114c88147d",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    },
    {
        "hash": "7a13528285e60d021a8e1851200b310c3af327a0c89ada19f12b55ce1d0b790e",
        "height": 62785,
        "timestamp": "2021-05-19T13:09:40.480Z",
        "era": 586,
        "parent_hash": "e1d05d355ea02c13ac0b1726ac650721cba1e907a40732c2a0f08922515e8315",
        "state_root_hash": "2a10b462188aff567bf61a625d9551626660bed40f9759fd71cac3ad7489f172",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    },
    {
        "hash": "e8d3b648e174548004de4443feeb40390417a180258f62b9a97bc665f2de596f",
        "height": 62765,
        "timestamp": "2021-05-19T12:47:49.760Z",
        "era": 586,
        "parent_hash": "1f9cc0d6410d5e8d2da917d1c5a5032744b7f7b693b844b8b9dc67aaa67662b3",
        "state_root_hash": "d7cbf4ac6db1bf2a3b4112a3649c541a5a5bac6c5045c76e703b77a817f21475",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    },
    {
        "hash": "59b613d14dd4f55855aa4ddeeaed580caf0129647bbd20c0b4e41588e5cf7c18",
        "height": 62739,
        "timestamp": "2021-05-19T12:19:25.824Z",
        "era": 585,
        "parent_hash": "b14bbcdb48c2dc13dd87f2214628fe2e527b1a2b61dbcf9471a5aab2b47d0591",
        "state_root_hash": "311380ab9a800300c27885605a7d9e26c7273f4e67d83dcfef6c4410901108ce",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    },
    {
        "hash": "b14bbcdb48c2dc13dd87f2214628fe2e527b1a2b61dbcf9471a5aab2b47d0591",
        "height": 62738,
        "timestamp": "2021-05-19T12:18:20.288Z",
        "era": 585,
        "parent_hash": "83444f50c93e74d89b6ca9c108c4496ad51bf6d701a9dd862e46b64f5a207f92",
        "state_root_hash": "5f8694169afc49f8d9d7b13818348bfaa46592310cf8eb2e353ce0f434417569",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    },
    {
        "hash": "0100f62fb8d29c615c74a511d40fd84e5a82b45bf83e866962035c355358afa2",
        "height": 62639,
        "timestamp": "2021-05-19T10:30:12.224Z",
        "era": 584,
        "parent_hash": "636472a62b679aba70268fdafbd21247b698ce888926530c4631863275f90649",
        "state_root_hash": "31ddd19cc4fd0d1cafd58459f50c17459f4c91ab7418a5fed5708ffd50353cdf",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    },
    {
        "hash": "ffef4e46c01dbff1d47b7c942e72051dd1dc11f7758857f0ea03d5cdca8ce43f",
        "height": 62590,
        "timestamp": "2021-05-19T09:36:40.960Z",
        "era": 584,
        "parent_hash": "e4b9a4d30987c602b4ec82d20960ef8be946312ac26114c1266ad7d8ace5d882",
        "state_root_hash": "a075635303250b6381237bf08c9916b2d1b6299480387a796c5d76c29035f067",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    },
    {
        "hash": "02d8e92b720468de365bcba67c20b5633753b5979f56d31e98126e28b970d527",
        "height": 62547,
        "timestamp": "2021-05-19T08:49:42.912Z",
        "era": 584,
        "parent_hash": "e8a89e343ea4a5af1344d9bd122318046ddaad0c1e0906375388df968ed0dd08",
        "state_root_hash": "9063119c2191c688db5c30ad925cd947556c4f65f1dc36b832b0a950611f23cc",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    },
    {
        "hash": "f3044f4f73f7218b311c18432aef943b6bdf661347c9ddcdf150e012f4e7c064",
        "height": 62528,
        "timestamp": "2021-05-19T08:28:57.728Z",
        "era": 583,
        "parent_hash": "8bc6277b16225ded97f98cf43cc00006ce5edaf0a2cbea4a9c5100ed4a7b6cd5",
        "state_root_hash": "18e2b45d223189b5a47edf3595540f5baecb8c9ee830a0821b237dab86a52005",
        "validator": "01419478cc7a68037c553c0214d595cb6b432c71ef73ece0d7a5f98c5eb1ecb44a"
    }
]
```


| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| validator | string | Validator's public_key | Yes |
| start | index number | start | Yes |
| count | number of blocks return |  end | Yes |


### Info

#### get-deploy

```
url: /info/get-deploy/:hex

example: https://api.casperstats.io/info/get-deploy/e48d18ff10e0935f7d1f6ec4044e2b390e4209dab9e1ba6de6ad27db00aabee2

method: GET

des: Retrieves a deploy from the network

successResponse: Deploy data
```

| Params  | Type | Description |
| ------------- | ------------- | ------------- |
| id | number | JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned |
| hex | string |  Hex-encoded deploy hash |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


#### get-list-deploys

```
url: /info/get-list-deploys?id=&b=

example: https://api.casperstats.io/info/get-list-deploys?id=13&b=3207ff3e5d94984a6ab8de908764f8a2c8b4acbcc1ed5970b26728ac2b2b4490

method: GET

des:  Retrieves the list of all deploy hashes in a given block

successResponse:
{
    "api_version": "1.0.0",
    "deploy_hashes": [
        "c51ce21e9d124bb6a9944ef4855ff42790297386c14632d8146c5ab0ee88a8ed"
    ],
    "transfer_hashes": []
}
```

| Params  | Type | Description |
| ------------- | ------------- | ------------- |
| id | number | JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned |
| b | string, number |  Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


#### get-type

```
url: /info/get-type/:param

example: https://api.casperstats.io/info/get-type/e4753c7282ed884beb6394425e51c3db80f2217b89b0e692cf923bbdfd9bbb2d

method: GET

des:  Get type of input

successResponse:
{
    "value": "db5f69c51ddacaeab0bee5c7e5665313489d99ffbbadd9208ff45092ee85476f",
    "type": "TRANSFER_HEX"
}
```

| TypeName  | Type | Description |
| ------------- | ------------- | ------------- |
|  PUBLIC_KEY_HEX | string | account address |
|  BLOCK_HEIGHT| number | block height |
|  BLOCK_HASH| string |  |
|  DEPLOY_HEX| string |  |
|  TRANSFER_HEX| string |  |
|  VALIDATOR| string |  |
|  UNKNOWN| string | can not search the data |


#### get-circulating-supply

```
url: /info/get-circulating-supply/

example: https://api.casperstats.io/info/get-circulating-supply

method: GET

des:  Get type of input

successResponse:
{
    "circulating_supply": "402220054717844053"
}
```


#### get-volume

```
url: /info/get-volume/:count

example: https://api.casperstats.io/info/get-volume/7

method: GET

des:  Get daily volume of the last $count day
successResponse:
[
    [
        1623024000,
        "4018781675681948"
    ],
    [
        1622937600,
        "3032557482032474"
    ],
    [
        1622851200,
        "2409382179079425"
    ],
    [
        1622764800,
        "4434629671123415"
    ],
    [
        1622678400,
        "5449203423548012"
    ],
    [
        1622592000,
        "83708531496625016"
    ],
    [
        1622505600,
        "6654644907446674"
    ]
]
```

#### get-transfer-volume

```
url: /info/get-volume/:count

example: https://api.casperstats.io/info/get-transfer-volume/7

method: GET

des:  Get daily volume transfers of the last $count day
successResponse:
[
    [
        1623024000,
        207
    ],
    [
        1622937600,
        200
    ],
    [
        1622851200,
        268
    ],
    [
        1622764800,
        292
    ],
    [
        1622678400,
        400
    ],
    [
        1622592000,
        326
    ],
    [
        1622505600,
        246
    ]
]
```


#### get-stats

```
url: /info/get-stats

example: https://api.casperstats.io/info/get-stats

method: GET

des:  Get daily stats
successResponse:
{
    "holders": 7257,
    "holders_change": 4575,
    "validators": 85,
    "validators_change": 0,
    "circulating": "591181941000000000",
    "circulating_change": 0,
    "total_supply": "10141086469000000000",
    "total_supply_change": 0,
    "price": 0.265445,
    "price_change": -2.84416,
    "marketcap": 156908740,
    "marketcap_change": 0.14022,
    "transactions": 0,
    "transactions_change": null,
    "transfers": []
}
```


| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
| holders |  number | current number of holders |
| *_change | number | percentage of changes last 24 hours |
| transfers | number | volume transfers on last 60 days (on-chain) |


#### economics

```
url: /info/economics

example: api.casperstats.io/info/economics

method: GET

des:  Get economics data
successResponse:
{
    "block_height": 96781,
    "total_supply": "10149193416000000000",
    "circulating_supply": "591654542000000000",
    "APY": 20.835474392551617,
    "total_stake": "3705014517126291500",
    "total_active_validators": 86,
    "total_bid_validators": 97,
    "total_delegators": 614,
    "total_reward": "149193416334775682"
}
```

### State

#### query-state

```
url: /sate/query-state?id=&s=&k=

example: https://api.casperstats.io/state/query-state?id=12&s=97d55e7074133c9bf7ff1d7b1c9c6f5f84bff888bf0087f16d139356d334170f&k=01aea113d82a9d562563a2802b1abee7ac1ea40b6c100ddeda8e9be5666e1319dc

method: GET

des: etrieves a stored value from the network

successResponse:
{
    "id": 12,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "merkle_proof": "18220 chars",
        "stored_value": {
            "Account": {
                "account_hash": "account-hash-788ba4182fac46670a78ca01e12b6e472e644f7dc9edf5088f5a3c448cc2097a",
                "action_thresholds": {
                    "deployment": 1,
                    "key_management": 1
                },
                "associated_keys": [
                    {
                        "account_hash": "account-hash-788ba4182fac46670a78ca01e12b6e472e644f7dc9edf5088f5a3c448cc2097a",
                        "weight": 1
                    }
                ],
                "main_purse": "uref-52d2021cafe721b5b114c3e45852178541e32ea1a904f904761a66d3dc804da0-007",
                "named_keys": []
            }
        }
    }
}
```

| Params  | Type | Description |
| ------------- | ------------- | ------------- |
| id | number | JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned |
| s | string |  Hex-encoded hash of the state root |
| k | string | key must be a formatted PublicKey or Key. This will take one of the following forms:
         01c9e33693951aaac23c49bee44ad6f863eedcd38c084a3a8f11237716a3df9c2c           # PublicKey
         account-hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20  # Key::Account
         hash-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20        # Key::Hash
         uref-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20-007    # Key::URef
         transfer-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20    # Key::Transfer
         deploy-0102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f20      # Key::DeployInfo  |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |

#### get-balance

```
1.
url: /state/get-balance/:address

example: https://api.casperstats.io/state/get-balance/01aea113d82a9d562563a2802b1abee7ac1ea40b6c100ddeda8e9be5666e1319dc

method: GET

des: Retrieves a purse's balance from the network

2.
url: /state/get-balance?id=&s=&p=

example: https://api.casperstats.io/state/get-balance?id=12&s=97d55e7074133c9bf7ff1d7b1c9c6f5f84bff888bf0087f16d139356d334170f&p=uref-52d2021cafe721b5b114c3e45852178541e32ea1a904f904761a66d3dc804da0-007

method: GET


successResponse:
{
    "id": 12,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "balance_value": "1000000000000",
        "merkle_proof": "18426 chars"
    }
}
```

| Params  | Type | Description |
| ------------- | ------------- | ------------- |
| id | number | JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned |
| s | string | Hex-encoded hash of the state root  |
| p | string |  The URef under which the purse is stored. This must be a properly formatted URef "uref-<HEX STRING>-<THREE DIGIT INTEGER>" |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


#### get-auction-info

```
url: /state/get-auction-info

example: https://api.casperstats.io/state/get-auction-info

method: GET

des: Retrieves the bids and validators as of the most recently added block


successResponse:

{
    "api_version": string,
    "auction_state": {
        "state_root_hash": string,
        "block_height": number,
        "era_validators": [ ],
        "bids": []
    }
}

```

| Params  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |


#### get-validators

```
url: /state/get-validators/:number

example: api.casperstats.io/state/get-validator/0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c

method: GET

des: Return the number of top validator by total stake


successResponse:

{
    "public_key": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c",
    "bid": {
        "bonding_purse": "uref-f8741b7cd2fce2069998eaeac3dfac543284dc3cff6973ba63f2c11a5d9d548b-007",
        "staked_amount": "60420413461486",
        "delegation_rate": 10,
        "delegators": [
            {
                "public_key": "012325dc6969af448e93fe5299571ae6b4f0ad87b0a51df9f34225b242116416d1",
                "staked_amount": "7960933176827136",
                "bonding_purse": "uref-32d6fdbbbafc77ddddb8ae4ad633b18bdd354bbe1bcf3427800bef8c582a9228-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01b7b1b5856758bd59ebb8beebccd6dbf4bc489628032921dd83e54c919b4d0a72",
                "staked_amount": "7960933176827136",
                "bonding_purse": "uref-0ad9da724056eedeffa39a037da46af00780c718abbdb5e90c7b6c7700166f4c-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01c4dcd4f6676ea296c013c9d2ce82e78b6eff0617f061d50626748a1d9196dcfb",
                "staked_amount": "7960933176827136",
                "bonding_purse": "uref-e731465041b974e099779d05f28c508b15152b8e150ab07d44a4521f148b608a-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "016a0f6e2a18688f89b4262d048d57bce3df7aad70c1f5fae7be7daee02cb0edb1",
                "staked_amount": "2653644392275553",
                "bonding_purse": "uref-deffca02af6c63e144cbfde233358936f00489f78406fcb09b47e18b35ce6a27-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "0157a50432fbb567937ea38f7a4c2a4afda006021102ce6a6e936b81dc6f4e351c",
                "staked_amount": "281613615130434",
                "bonding_purse": "uref-0f23181838cedd505896f06586931d578ef18caf0e5b3e66a68823011d96ae30-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "015a49934ae5414f82614cb983ee37d9781a74a7e819bab19637589e63ebe498e8",
                "staked_amount": "167114147310423",
                "bonding_purse": "uref-79b55d67310e349a08a6d82ee5f009c7dba6f42eb5625d9e0c7ab5f141b29316-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01657a8879d66b9a97a0f3cb603c6f03bf5ceede7659566ead2dd4d1cb2f3d2662",
                "staked_amount": "165990364131026",
                "bonding_purse": "uref-a19a807e21209e6e3e668cb77f69deae3cd0c3b62c3455afcce2fc9f996a315a-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01774c5e3957c6df183fed123bd9d3955d5c7158e81b121ca5140d8b3ec57ce749",
                "staked_amount": "162210008584669",
                "bonding_purse": "uref-1162e60f97f63426114ccfb5f166825f7eb6cae48069af25d967dc98c154a276-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01416bc2de2a41734f7f9af625aa44f4b286f96e00607f683de90a38f46d291197",
                "staked_amount": "150154564307824",
                "bonding_purse": "uref-3ab544a20e495cd5602b523d9dfd06a643d340daffafb70fea5b6695e90e1be4-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "013682f5656c5ae7730aa84bad542241d72362ddbffdd326ec9b7a120acbd6f3f5",
                "staked_amount": "123910642344794",
                "bonding_purse": "uref-64f3e14f303936af0a9a67fc96433a8f941da3b8dfdc314e2621de1f62c19bcf-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "011bd705874e263197ac6a940e8aa4773a9f6f027b742f80b3f72d6b2a0c38e381",
                "staked_amount": "68481243951221",
                "bonding_purse": "uref-85e91f133827263d0b0e5d9d4c9eced546e1256c5b5d966fad9a3cd6b9ce8f40-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01b1ceda22b17f9848ab04ea034977bffdf0b43c4afef4ec405b4bbb23fd1ef034",
                "staked_amount": "45154269951254",
                "bonding_purse": "uref-9da0da736ded3bc69c72e6b5eb8d02e5d545a9a92b57f141bd5b0b29187a2d87-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01ef5645fdbfb6b69f84daabaeaf05e9b0eef7f2653126286ead041d8a4cac0d6f",
                "staked_amount": "40079611096686",
                "bonding_purse": "uref-2b83e322765b0ef2666cbdb38f3390f2e5472af6da84e654635433d07b592582-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01c6626d121843a499b536e01f631f27a0649bbe7dd997f0eec0cfe9bb8395c528",
                "staked_amount": "24911689448616",
                "bonding_purse": "uref-95acaf4018527e429c351738d08629a4b3c8c8fd4f96cfade4fe22096e5556ca-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "020230c20cfafb229e931602553c482ca0a93a57dc62a2c9e7a0996cdfbf765704f7",
                "staked_amount": "20004287690673",
                "bonding_purse": "uref-f7b197bdd4d97478d32e9a1355e272645b2f21272d232d834721611b7da19d4f-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "016db713c7dd385b1f35cb68e18e4621fdd09fe4ef7a4ce60475dd1ad4aec2d149",
                "staked_amount": "10580424413953",
                "bonding_purse": "uref-d10531d8b5f1fe8649d9b52e112a9a5781c0d992cb5310a3d2e5e3549862cab5-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "019d4b3cfc743ece28be983f45a783ffea6d1ee6fffa49e6239e6bf6b5308f6b4d",
                "staked_amount": "9011981082724",
                "bonding_purse": "uref-fb363e42ca54df5d1eb9c3bc977904b538bbdaf21e17a5f59efa4bf6fadf9e44-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01cec85f26557e6fd128db1573fbbed3d6b8803bf567e021722d0bcc86f6d13c7e",
                "staked_amount": "8190996835902",
                "bonding_purse": "uref-05656fe3bbd9471948d42200b3592da42455d1df9fa88ea98c665f05cfa4d44f-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01fe1f528e83343d1e32c3d7f69eb5584efc4d4668cace4ec1c5805008459895a8",
                "staked_amount": "6370466733628",
                "bonding_purse": "uref-89bc2a961f5a371650ec2ed88e1184c67f9888b21e192e2382964de4c85d900f-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01c29f0c214bfa5d33a0a93d7b56b734985c9fdc16af19fc3d1224537b025f2499",
                "staked_amount": "6335695316164",
                "bonding_purse": "uref-70313a28710ce9b4176e9921de457f4ca3a4d01ebc7673a1f9e29256a1ee570e-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "016b736f641a642876a1c2cbecd7e34298405f594cf01e782b58e13f6596cd80a4",
                "staked_amount": "6004240416584",
                "bonding_purse": "uref-df412bda2dca1a65fe3d22adbcd1309a4dfe6212919ec9edeb5a13a36af5f2b1-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01cf8c3516007486b874ab1a93dbf70a5ef44f60052363d17ea6aeb50aa940cfe1",
                "staked_amount": "6004240416584",
                "bonding_purse": "uref-aae0dae653e0c12cc6c3150efe43deab5026691e59085bf2b70141d364d799e5-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "017a75279f84dfa3884c64302a47ca8038a113d5d2106fed6b92b6d138f517b3d9",
                "staked_amount": "6001543674237",
                "bonding_purse": "uref-43c8b677b7ac3a1ae9a11e7e793acb27ebb53172c71644eda35fad72914d3b75-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "0172917e7bc7d316a765b64090851cc3b797bef205c7cf2529a2f7a3ebfde187ac",
                "staked_amount": "5020887248067",
                "bonding_purse": "uref-6e47280cf55775891582a0cf33fe779c609f4d85ab682581a6721e417fb8b601-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "0172986948019775426c430bae79e4922d0c2e186fd8d9c30bc89b07463e3d5070",
                "staked_amount": "5006871594878",
                "bonding_purse": "uref-3215acb14fe1adf52c8fb0b92674048ef241a58ec24587bbf9dcaa26dd21b34e-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "019692509a1bda17f64ecb9a38487e07c56d0713b0c1278da5568aae89b3d86fcc",
                "staked_amount": "4646634001751",
                "bonding_purse": "uref-224cfe97461cc7c0855fac24d9ef9700c3f996d191b6efbc03fe0de47df8d2a4-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01b32eba49d678461154871460e513bb8041c5af65cbbf79202903915415d81daa",
                "staked_amount": "2533915010000",
                "bonding_purse": "uref-747f6a09af1d62b255d1cadce006ab401c550b2968608ca5a08e7716a5186527-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "018e167b5df850e316be22bc60035ab8a9c507caceb399346ee0ad6a74998baf02",
                "staked_amount": "950856320623",
                "bonding_purse": "uref-ef38361ac97c931185b3f643bb7af122c469f95406442616486eddb081832904-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01f7c72fcd8feca77a68a1ba48a7cf9052faba6939f0a2e4929b57436bcab18cdd",
                "staked_amount": "612109944038",
                "bonding_purse": "uref-5dae1550bf97efff0777c71e04d3fe823e701929b327476ae5673eeda8bdc2f5-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "0126fad2280297ece7b93ab5e4d695a62022a8af5450db145366a2409feaea4e9c",
                "staked_amount": "599385517592",
                "bonding_purse": "uref-70495fc8356ed1196f98cac8f35029dd1910becc19b720e99dd33c2536a438c8-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "014e1b5ece73748ea7f7d7a3bf0484f3e806ac737831a0125885bc50d92c007d02",
                "staked_amount": "526680968503",
                "bonding_purse": "uref-cdd9e6b4e9cf84a0627a944bb077273e55f8d940c2c9572c28b7be8be3a7c60f-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01ddb41a7d5f93bf51fe298651d296320783d7c56f66115773e7f096d0aece9009",
                "staked_amount": "250236097887",
                "bonding_purse": "uref-690b102c3d4082783d0ed2c5eccee393820a667e7064014d81a15f6e9954ea4e-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01c2edd887aea802efd886efdd737dea814d47b7efc746a5679bb5e9ecd00a6d2a",
                "staked_amount": "127322123493",
                "bonding_purse": "uref-762ef93b39d0f273b85072db6e98d03aebc1a3c9f77b18464d977faf16d384dc-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01275c64f176aba54561e487a1380f7a19dba30bd2226ebdf5f30ba1e4ef9a60ba",
                "staked_amount": "97070761791",
                "bonding_purse": "uref-10adfb50566add2a6ca396d2e4698416f3a0a18a45f5956b8ed98fff05350503-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01eeb91af0a1ef241891f31258ecabe71573719aff3f440736834f36645eb2af4e",
                "staked_amount": "27031304230",
                "bonding_purse": "uref-29cd7bca783156288e6f88361218c803d4889bf47544547a75e3da230b8f625e-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01e7ddcfd7d2edf728b951cd6182e1a9fa00286db1a8762b643c810a4fd2e43484",
                "staked_amount": "10015036091",
                "bonding_purse": "uref-a7e9d4c018c78660fdb6925590aedaafa781ec16c612087510bc3211488f5986-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01649008b3ea960cee5ef072128c350177ccdc6de8d2b6feb87609bfd8c1e44a15",
                "staked_amount": "9969406130",
                "bonding_purse": "uref-d50beea94e5df10d79d1005069edf464d8b54282f6cc12964634308892aaf3e3-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            },
            {
                "public_key": "01d8cce3cfb64584f4c2bd4198d66eba972e3cafe7242dabe389b9150ac0d8d575",
                "staked_amount": "3003993679",
                "bonding_purse": "uref-0481dff3c9dbf1e2b5b484bb94cfde21cff4549bdf4075046c6f9e1ee2bae127-007",
                "delegatee": "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c"
            }
        ],
        "inactive": false,
        "total_stake": "27925410358384596"
    },
    "total_reward": "29761433325232",
    "APY": 18.759037187619697
}

```


#### get-validator

```
url: /state/get-validator/:address

example: https://api.casperstats.io/state/get-validator/017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e

method: GET

des: Return the information of validator


successResponse:

{
    "public_key": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e",
    "bid": {
        "bonding_purse": "uref-cf4eb33f501ad2ee391d1d0ca0c1e9381e9edca10f3d85115f9c18474e1837ad-007",
        "staked_amount": "99367483739340",
        "delegation_rate": 10,
        "delegators": [
            {
                "public_key": "012d2d359ac59dd92203c7fbaf7ec98dd0b16c51817e46fed69f1f66c5482bfec9",
                "staked_amount": "10123673503",
                "bonding_purse": "uref-e2f24f97869539f26a928dcd9fcd90d4de46c96b59242f7fa0958a4d13d11a3b-007",
                "delegatee": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e"
            },
            {
                "public_key": "015ba7402719a9f01a34cfa7548a625868930423ebbbe6ac64d7136a98ef5ba377",
                "staked_amount": "101236735045",
                "bonding_purse": "uref-9808ffc58daed94f8f3b36af1712e0b5a3790bf3a52b4c013a2c3f5096620505-007",
                "delegatee": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e"
            },
            {
                "public_key": "016faf01fa34c6ca0154fb4e7edf2a463b4408c432c0657c3f4f03dad80dd475dc",
                "staked_amount": "8578174656",
                "bonding_purse": "uref-e3da6a65e12068c48d61de7d54845d5e6d39e2c1ba34669ded1d6f312d624563-007",
                "delegatee": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e"
            },
            {
                "public_key": "019ff45f15e07b6c3f42744424d1bde635e8ca295a0be3f485573d4bbbba3c05c4",
                "staked_amount": "4011712621",
                "bonding_purse": "uref-5264a6ec0e11d8642983139ab3b4b05ccae5b04c1e4588e0b48eb69c2faf8915-007",
                "delegatee": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e"
            },
            {
                "public_key": "01cbed6cfe8643428bc04e4505c3495c266d19527a0d1164ab7e549831ba8d5229",
                "staked_amount": "970460513089",
                "bonding_purse": "uref-9471fb183700edaaa3b50a166c9cbdf8951bd61892738bf14ba0291d0d407932-007",
                "delegatee": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e"
            }
        ],
        "inactive": false,
        "total_stake": "100461894548254"
    }
}

```



#### get-era-validators

```
url: /state/get-era-validators

example: https://api.casperstats.io/state/get-era-validators

method: GET

des: Return the information of validatos


successResponse: validators information


```

#### get-bids

```
url: /state/get-era-validators

example: https://api.casperstats.io/state/get-bids

method: GET

des: Return inforamtion of bids

successResponse: bids information


```

