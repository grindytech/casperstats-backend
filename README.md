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
    - [get-holder](#get-holder)
    - [get-transfers](#get-transfers)
    - [get-deploys](#get-deploys)
    - [get-rich-accounts](#get-rich-accounts)
    - [count-holders](#count-holders)
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
    - [get-circle-supply](#get-circle-supply)
    - [get-volume](#get-volume)
    - [get-transfers-volume](#get-transfers-volume)
 
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

example: https://api.casperstats.io/account/get-account/0190c434129ecbaeb34d33185ab6bf97c3c493fc50121a56a9ed8c4c52855b5ac1

method: GET

des:  Get information of the account

successResponse:
{
    "public_key": "0190c434129ecbaeb34d33185ab6bf97c3c493fc50121a56a9ed8c4c52855b5ac1",
    "account_hash": "41a5d1bc379d235fa0e745b04eb32af590ec064279c8d44f50865e55f8347836",
    "balance": "29019240000"
}
```

  #### get-holder
  
  ```
url: /chain/get-holder/:account

example: https://api.casperstats.io/account/get-holder/01a9a366e66d6081d6e15e4a83cc33bb465669444d386eb43354b81e5740abbd07

method: GET

des:  Get publickey or account_hash depends on the input

successResponse:
{
    "public_key_hex": "01a9a366e66d6081d6e15e4a83cc33bb465669444d386eb43354b81e5740abbd07",
    "account_hash": "fddc9e59905430de5bba59aa955eb21709614a574e9eee5a44fe967a8655ef28"
}
```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| account | string | public_key or account_hash | Yes |

  #### get-transfers
  
  ```
url: /chain/get-transfers/:account

example: https://api.casperstats.io/account/get-transfers/?account=01a9a366e66d6081d6e15e4a83cc33bb465669444d386eb43354b81e5740abbd07&count=10

method: GET

des:  Get number of transfers of account


successResponse:
[
    {
        "deploy_hash": "9bd16eb573f05fd0c6942ccbd3c315ad830efee9837ea7bf87517cd76bd8457d",
        "from_address": "496d542527e1a29f576ab7c3f4c947bfcdc9b4145f75f6ec40e36089432d7351",
        "to_address": "fddc9e59905430de5bba59aa955eb21709614a574e9eee5a44fe967a8655ef28",
        "value": "12842200000000",
        "fee": "0",
        "from_balance": "20067008805760358",
        "to_balance": "990000"
    },
    {
        "deploy_hash": "489ea64c920e5fcb6d82a8d411e5b146781f1fa93825c3ec7aec9b8e75d4acef",
        "from_address": "fddc9e59905430de5bba59aa955eb21709614a574e9eee5a44fe967a8655ef28",
        "to_address": "94664ce59fa2e6eb0cc69d270fc91dd9dd2ba02a1f7964c69f036ef4a68bb96f",
        "value": "12842199990000",
        "fee": "0",
        "from_balance": "990000",
        "to_balance": "208907540949605242"
    },
    {
        "deploy_hash": "fb51b58c06e0f61e97765fce72d0350658b648e7a5180cbd2bd4c4c680803deb",
        "from_address": "496d542527e1a29f576ab7c3f4c947bfcdc9b4145f75f6ec40e36089432d7351",
        "to_address": "fddc9e59905430de5bba59aa955eb21709614a574e9eee5a44fe967a8655ef28",
        "value": "22411700000000",
        "fee": "0",
        "from_balance": "20067008805760358",
        "to_balance": "990000"
    }
]
```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| account | string | public_key or account_hash | Yes |
| count | number | number of transfers will be return | Yes |


  #### get-deploys
  
  ```
url: /chain/get-deploys/:account

example: https://api.casperstats.io/account/get-deploys/?account=01a9a366e66d6081d6e15e4a83cc33bb465669444d386eb43354b81e5740abbd07&count=4

method: GET

des:  Get number of deploys of an account

successResponse:
[
    {
        "deploy_hash": "19ed303b7e54d47cd1403ba9ef5aa992add3aee9c827ebce8bb54c636fab63e1",
        "hash": "96e75a41c4a39ff5b5bfa89f84d66fb509c5876cbe0b2336fab4145c26361afe",
        "timestamp": "2021-05-19T05:15:21.645Z",
        "public_key": "01a9a366e66d6081d6e15e4a83cc33bb465669444d386eb43354b81e5740abbd07",
        "gas_price": 1,
        "cost": "10000",
        "status": "success"
    },
    {
        "deploy_hash": "489ea64c920e5fcb6d82a8d411e5b146781f1fa93825c3ec7aec9b8e75d4acef",
        "hash": "ab16f72362487360995daf7a4937ba05f2bb91608880a176322c06b31c1af16a",
        "timestamp": "2021-05-18T23:46:41.691Z",
        "public_key": "01a9a366e66d6081d6e15e4a83cc33bb465669444d386eb43354b81e5740abbd07",
        "gas_price": 1,
        "cost": "10000",
        "status": "success"
    },
    {
        "deploy_hash": "6998077047ec1fbff11c107db34d5dd36596e5eb088de1d5f0a0fb2a0d93f8f4",
        "hash": "128eb0c66b8082939da61b6ba5925adfd1e4e96b024a83dc4e58c3f74ca7004c",
        "timestamp": "2021-05-19T03:27:16.165Z",
        "public_key": "01a9a366e66d6081d6e15e4a83cc33bb465669444d386eb43354b81e5740abbd07",
        "gas_price": 1,
        "cost": "10000",
        "status": "success"
    },
    {
        "deploy_hash": "c6a714f878de77d6ed00870ba8f6c13cbc5fc3d115c5c0a240e3d36f51d40911",
        "hash": "9bbd163fb043f54a1ed7408933ac8289ba0f49a7b24049f80f93609b84cfd967",
        "timestamp": "2021-05-18T23:48:53.499Z",
        "public_key": "01a9a366e66d6081d6e15e4a83cc33bb465669444d386eb43354b81e5740abbd07",
        "gas_price": 1,
        "cost": "10000",
        "status": "success"
    }
]
```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| account | string | public_key or account_hash | Yes |
| count | number | number of deploys will be return | Yes |


 #### get-rich-accounts
  
  ```
url: /account/get-rich-accounts/:count

example: https://api.casperstats.io/account/get-rich-accounts/10

method: GET

des:  Get number of deploys of an account

successResponse:
[
    {
        "account_hash": "94664ce59fa2e6eb0cc69d270fc91dd9dd2ba02a1f7964c69f036ef4a68bb96f",
        "public_key_hex": "",
        "balance": "202015814105797797",
        "active_date": "2021-05-18T22:56:21.072Z"
    },
    {
        "account_hash": "45f3aa6ce2a450dd5a4f2cc4cc9054aded66de6b6cfc4ad977e7251cf94b649b",
        "public_key_hex": "02029d865f743f9a67c82c84d443cbd8187bc4a08ca7b4c985f0caca1a4ee98b1f4c",
        "balance": "158485177433565525",
        "active_date": "2021-05-18T22:54:20.066Z"
    },
    {
        "account_hash": "496d542527e1a29f576ab7c3f4c947bfcdc9b4145f75f6ec40e36089432d7351",
        "public_key_hex": "0203f3f44c9e80e2cedc1a2909631a3adea8866ee32187f74d0912387359b0ff36a2",
        "balance": "17733390362368359",
        "active_date": "2021-05-18T22:58:32.217Z"
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


### Chain

   #### get-block
  
  ```
url: /chain/get-block/:block

example: http://18.184.201.146:3030/chain/get-block/69

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

example: http://18.184.201.146:3030/chain/get-block-transfers/54675

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

example: http://18.184.201.146:3030/chain/get-state-root-hash/69

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

example: http://18.184.201.146:3030/chain/get-latest-blocks/3

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

example: http://18.184.201.146:3030/chain/get-block-transfers/11661

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

example: http://18.184.201.146:3030/chain/get-block-deploy/54543

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

example: http://18.184.201.146:3030/chain/get-range-block?start=1000&end=1005

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
url: /chain/get-latest-tx/:number

example: http://18.184.201.146:3030/chain/get-latest-txs/3

method: GET

des: get number of latest transaction

successResponse:
[
    {
        "deploy_hash": "4b7709a04a1d8bb379ff702f1d19b561f70d0faa42916ca46f5ec9e4a9a4301d",
        "from": "account-hash-302fbd5a2013148e55fe0483229568e94af57828768db37206120387f791cd1c",
        "to": null,
        "source": "uref-200fbbacbeb80e515fa810f0e9c6d2962832e9ae08da673af572fc5d89c6058b-007",
        "target": "uref-6fec657027fe0e6235fccc9ee5836bec081321fc009854a0ea7b79de080b6b07-007",
        "amount": "900000000000",
        "gas": "0",
        "id": null
    },
    {
        "deploy_hash": "5de8cba264a82ede4623d0c07415a9c71c5bdab9fc3f43fcb551427666a700ca",
        "from": "account-hash-9a0822e9005889874fd36362db5ddaf4815d55e44c9cf1edf6c8be8971570c8b",
        "to": null,
        "source": "uref-c2c8f3387dccc28f070063b94b65ee6cb2983783ce564a6b8a5acf702de14571-007",
        "target": "uref-acc88de13a74724d2ebafb3abacd4f3c6ffc723dd258208822c181ead02be1ed-007",
        "amount": "900000000000",
        "gas": "0",
        "id": null
    },
    {
        "deploy_hash": "762619ae4746bbc347d65951ae02590688dbce53b02e0c1b173fdb7cf4d8d16e",
        "from": "account-hash-b383c7cc23d18bc1b42406a1b2d29fc8dba86425197b6f553d7fd61375b5e446",
        "to": "account-hash-302fbd5a2013148e55fe0483229568e94af57828768db37206120387f791cd1c",
        "source": "uref-b06a1ab0cfb52b5d4f9a08b68a5dbe78e999de0b0484c03e64f5c03897cf637b-007",
        "target": "uref-200fbbacbeb80e515fa810f0e9c6d2962832e9ae08da673af572fc5d89c6058b-004",
        "amount": "1000000000000",
        "gas": "0",
        "id": null
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
url: /chain/get-proposer-blocks?validator=&num=

example: http://18.184.201.146:3030/chain/get-proposer-blocks?validator=017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e&num=2

method: GET

des: get number of latest transaction

successResponse:
[
    {
        "block_height": 32035,
        "era_id": 406,
        "deploys": 0,
        "transfers": 0,
        "timestamp": "2021-05-13T02:58:10.560Z",
        "block_hash": "bc22422df5b3fa55a1fd120d847dfde14aebf820c3947741955f778bf54cad22"
    },
    {
        "block_height": 32022,
        "era_id": 406,
        "deploys": 0,
        "transfers": 0,
        "timestamp": "2021-05-13T02:43:58.592Z",
        "block_hash": "496a3fc3bb62d21967caa14d89d8b1ba87f47f485c98e290569b95d291f57dc1"
    }
]

```



### Info

#### get-deploy

```
url: /info/get-deploy/:hex

example: http://18.184.201.146:3030/info/get-deploy/e48d18ff10e0935f7d1f6ec4044e2b390e4209dab9e1ba6de6ad27db00aabee2

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

example: http://18.184.201.146:3030/info/get-list-deploys?id=13&b=3207ff3e5d94984a6ab8de908764f8a2c8b4acbcc1ed5970b26728ac2b2b4490

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

example: http://18.184.201.146:3030/info/get-type/e4753c7282ed884beb6394425e51c3db80f2217b89b0e692cf923bbdfd9bbb2d

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


#### get-circle-supply

```
url: /info/get-circle-supply/:param

example: http://18.184.201.146:3030/info/get-circle-supply

method: GET

des:  Get type of input

successResponse:
{
    "circle_supply": "402220054717844053"
}
```


#### get-volume

```
url: /info/get-volume/:count

example: http://18.184.201.146:3030/info/get-volume/7

method: GET

des:  Get daily volume of the last $count day
successResponse:
[
    {
        "date": "2021-05-24",
        "volume": null
    },
    {
        "date": "2021-05-23",
        "volume": null
    },
    {
        "date": "2021-05-22",
        "volume": null
    },
    {
        "date": "2021-05-21",
        "volume": null
    },
    {
        "date": "2021-05-20",
        "volume": null
    },
    {
        "date": "2021-05-19",
        "volume": "876274653665334"
    },
    {
        "date": "2021-05-18",
        "volume": "394980274159668"
    }
]
```

#### get-volume

```
url: /info/get-volume/:count

example: http://18.184.201.146:3030/info/get-transfers-volume/7

method: GET

des:  Get daily volume transfers of the last $count day
successResponse:
[
    {
        "date": "2021-05-24",
        "number_of_transfers": 0
    },
    {
        "date": "2021-05-23",
        "number_of_transfers": 0
    },
    {
        "date": "2021-05-22",
        "number_of_transfers": 0
    },
    {
        "date": "2021-05-21",
        "number_of_transfers": 0
    },
    {
        "date": "2021-05-20",
        "number_of_transfers": 0
    },
    {
        "date": "2021-05-19",
        "number_of_transfers": 53
    },
    {
        "date": "2021-05-18",
        "number_of_transfers": 21
    }
]
```



### State

#### query-state

```
url: /sate/query-state?id=&s=&k=

example: http://18.184.201.146:3030/state/query-state?id=12&s=97d55e7074133c9bf7ff1d7b1c9c6f5f84bff888bf0087f16d139356d334170f&k=01aea113d82a9d562563a2802b1abee7ac1ea40b6c100ddeda8e9be5666e1319dc

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

example: http://18.184.201.146:3030/state/get-balance/01aea113d82a9d562563a2802b1abee7ac1ea40b6c100ddeda8e9be5666e1319dc

method: GET

des: Retrieves a purse's balance from the network

2.
url: /state/get-balance?id=&s=&p=

example: http://18.184.201.146:3030/state/get-balance?id=12&s=97d55e7074133c9bf7ff1d7b1c9c6f5f84bff888bf0087f16d139356d334170f&p=uref-52d2021cafe721b5b114c3e45852178541e32ea1a904f904761a66d3dc804da0-007

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

example: http://18.184.201.146:3030/state/get-auction-info

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

example: http://18.184.201.146:3030/state/get-validators/3

method: GET

des: Return the number of top validator by total stake


successResponse:

{
    "block_height": 31104,
    "total_active_validators": 100,
    "total_bid_validators": 813,
    "total_stake": "1556302398004137",
    "era_validators": {
        "era_id": 398,
        "validators": [
            {
                "public_key": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e",
                "bid": {
                    "staked_amount": "96635006989003",
                    "delegation_rate": 10,
                    "delegators": 0,
                    "total_stake": "96635006989003"
                }
            },
            {
                "public_key": "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca",
                "bid": {
                    "staked_amount": "96634705486266",
                    "delegation_rate": 10,
                    "delegators": 0,
                    "total_stake": "96634705486266"
                }
            },
            {
                "public_key": "0105220d6629f6ef4484e2da5f58b6222832af8cabba4fbd7f1ad55e84a06ab319",
                "bid": {
                    "staked_amount": "50180676771243",
                    "delegation_rate": 10,
                    "delegators": 0,
                    "total_stake": "50180676771243"
                }
            }
        ]
    }
}

```


#### get-validator

```
url: /state/get-validator/:address

example: http://18.184.201.146:3030/state/get-validator/017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e

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

example: http://18.184.201.146:3030/state/get-era-validators

method: GET

des: Return the information of validatos


successResponse: validators information


```

#### get-bids

```
url: /state/get-era-validators

example: http://18.184.201.146:3030/state/get-bids

method: GET

des: Return inforamtion of bids

successResponse: bids information


```

