# casperstats-backend

This project provide the REST api to interact with Casper blockchain

# Table of contents

- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Reference](#reference)
  - [Installation](#installation)
- [API](#API)
  - [Account](#Account)
  
  - [Chain](#Chain)
    - [get-block](#get-block)
    - [get-block-tranfers](#get-block-tranfers)
    - [get-state-root-hash](#get-state-root-hash)
    - [get-latest-blocks](#get-latest-blocks)
    - [get-block-transfer](#get-block-transfer)
    - [get-block-deploy](#get-block-deploy)
    - [get-range-block](#get-range-block)

  - [Info](#Info)
    - [get-deploy](#get-deploy)
    - [get-list-deploys](#get-list-deploys)

  - [State](#State)
    - [query-state](#query-state)
    - [get-balance](#get-balance)
    - [get-auction-info](#get-auction-info)
    - [get-validators](#get-validators)

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


### Chain

   #### get-block
  
  ```
url: /chain/get-block/:block

example: http://18.157.183.184:3030/chain/get-block/69

method: GET

des:  Retrieves a block from the network

successResponse:
{
    "id": 13,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "block": {
            "body": {
                "deploy_hashes": [
                    "a57ac2f4e443f69e3dd6e5f9d6a0113e5b3578f68e348a2527ef6d22cfc11bbf",
                    "d3332cfabae9bf4333916565df47da89c3cd6b833ca76a55a8fc4a5ed32ea46a"
                ],
                "proposer": "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca",
                "transfer_hashes": []
            },
            "hash": "8eec00f58216737005c26b4fab8b362ad494501c0f5301f66d47a080b8fd98bf",
            "header": {
                "accumulated_seed": "6f16aaa68284b0768df31a4a6d84a02496f4534d26d78294bf0898c4e9406b0a",
                "body_hash": "3b087fa06d5760c24ea6a37d4b31147f679dab8066e8a3183bf1528127fdba9c",
                "era_end": null,
                "era_id": 0,
                "height": 69,
                "parent_hash": "f30a5a049db647d768690ba80a75d190f2a53f2aabbe33c63dc7016773b22620",
                "protocol_version": "1.0.0",
                "random_bit": false,
                "state_root_hash": "5b404d23913e8b57ee94e71a3ab41308187f67b9f33d47888db97d6b783b8850",
                "timestamp": "2021-04-08T18:16:18.688Z"
            },
            "proofs": []
        }
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

example: http://18.157.183.184:3030/chain/get-block-tranfers/69

method: GET

des: Retrieves all transfers for a block from the network

successResponse:
{
    "api_version": "1.1.0",
    "block_hash": "8eec00f58216737005c26b4fab8b362ad494501c0f5301f66d47a080b8fd98bf",
    "transfers": [
        {
            "deploy_hash": "d3332cfabae9bf4333916565df47da89c3cd6b833ca76a55a8fc4a5ed32ea46a",
            "from": "account-hash-b6bb3f6a2ce576d9f571785976b8bbbd981f08a7ea59afd70cf0482685ffc1ea",
            "to": null,
            "source": "uref-8f1be39ceb3fe9460d85cb1e477053710be6c6d847071f94b7b5653adb2a4498-007",
            "target": "uref-39f00d08b5a409ef5f2e8d04023f9433894975df46da548d50b866a1460d2960-007",
            "amount": "999000000000",
            "gas": "0",
            "id": null
        }
    ]
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


#### get-state-root-hash

```
url: /chain/get-state-root-hash/:block

example: http://18.157.183.184:3030/chain/get-state-root-hash/69

method: GET

des: Retrieves a state root hash at a given block

successResponse:
{
    "jsonrpc": "2.0",
    "id": 1620380971698,
    "result": {
        "api_version": "1.1.0",
        "state_root_hash": "5b404d23913e8b57ee94e71a3ab41308187f67b9f33d47888db97d6b783b8850"
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

example: http://18.157.183.184:3030/chain/get-latest-blocks/3

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

#### get-block-transfer

```
url: /chain/get-block-transfer/:block

example: http://18.157.183.184:3030/chain/get-block-transfer/11661

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

example: http://18.157.183.184:3030/chain/get-block-deploy/11661

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

example: http://18.157.183.184:3030/chain/get-range-block?start=1000&end=1005

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


### Info

#### get-deploy

```
url: /info/get-deploy/:hex

example: http://18.157.183.184:3030/info/get-deploy/c51ce21e9d124bb6a9944ef4855ff42790297386c14632d8146c5ab0ee88a8ed

method: GET

des: Retrieves a deploy from the network

successResponse:
{
    "id": 13,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "deploy": {
            "approvals": [
                {
                    "signature": "130 chars",
                    "signer": "01e3c9ceef6d5c172f7521d2042bbbf2bac3e28eba9953e87124b3f5058d67854b"
                }
            ],
            "hash": "c51ce21e9d124bb6a9944ef4855ff42790297386c14632d8146c5ab0ee88a8ed",
            "header": {
                "account": "01e3c9ceef6d5c172f7521d2042bbbf2bac3e28eba9953e87124b3f5058d67854b",
                "body_hash": "94f0ca8665453b7820e22cf7eda6af27bce6e89447b44f1101d2ee5591d0f143",
                "chain_name": "casper-test",
                "dependencies": [],
                "gas_price": 1,
                "timestamp": "2021-04-20T02:21:47.479Z",
                "ttl": "30m"
            },
            "payment": {
                "ModuleBytes": {
                    "args": [
                        [
                            "amount",
                            {
                                "bytes": "0400ca9a3b",
                                "cl_type": "U512",
                                "parsed": "1000000000"
                            }
                        ]
                    ],
                    "module_bytes": ""
                }
            },
            "session": {
                "ModuleBytes": {
                    "args": [
                        [
                            "public_key",
                            {
                                "bytes": "01e3c9ceef6d5c172f7521d2042bbbf2bac3e28eba9953e87124b3f5058d67854b",
                                "cl_type": "PublicKey",
                                "parsed": "01e3c9ceef6d5c172f7521d2042bbbf2bac3e28eba9953e87124b3f5058d67854b"
                            }
                        ],
                        [
                            "amount",
                            {
                                "bytes": "05006481d8e1",
                                "cl_type": "U512",
                                "parsed": "970000000000"
                            }
                        ],
                        [
                            "delegation_rate",
                            {
                                "bytes": "0a",
                                "cl_type": "U8",
                                "parsed": 10
                            }
                        ]
                    ],
                    "module_bytes": "1501370 chars"
                }
            }
        },
        "execution_results": [
            {
                "block_hash": "3207ff3e5d94984a6ab8de908764f8a2c8b4acbcc1ed5970b26728ac2b2b4490",
                "result": {
                    "Success": {
                        "cost": "235844850",
                        "effect": {
                            "operations": [
                                {
                                    "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                                    "kind": "Read"
                                },
                                {
                                    "key": "uref-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91-000",
                                    "kind": "Write"
                                },
                                {
                                    "key": "balance-4dbdee16446c4550f1a1d53df45a9be2f098efb548c1b1ec13f7edaca02cb666",
                                    "kind": "Write"
                                },
                                {
                                    "key": "balance-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91",
                                    "kind": "Write"
                                },
                                {
                                    "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                                    "kind": "Read"
                                },
                                {
                                    "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                                    "kind": "Read"
                                },
                                {
                                    "key": "bid-72dead79e8c78f3048cc9894e9ede95c5bfec4659edc269285edbe2023369272",
                                    "kind": "Write"
                                },
                                {
                                    "key": "deploy-c51ce21e9d124bb6a9944ef4855ff42790297386c14632d8146c5ab0ee88a8ed",
                                    "kind": "Write"
                                },
                                {
                                    "key": "hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2",
                                    "kind": "Read"
                                },
                                {
                                    "key": "balance-79d3dfcf1309dadd0bb25c105b62a6651acfcd6b8984d95365cf388c66a902db",
                                    "kind": "Write"
                                },
                                {
                                    "key": "transfer-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91",
                                    "kind": "Write"
                                }
                            ],
                            "transforms": [
                                {
                                    "key": "bid-72dead79e8c78f3048cc9894e9ede95c5bfec4659edc269285edbe2023369272",
                                    "transform": {
                                        "WriteBid": {
                                            "bonding_purse": "uref-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91-007",
                                            "delegation_rate": 10,
                                            "delegators": {},
                                            "inactive": false,
                                            "staked_amount": "970000000000",
                                            "validator_public_key": "01e3c9ceef6d5c172f7521d2042bbbf2bac3e28eba9953e87124b3f5058d67854b",
                                            "vesting_schedule": null
                                        }
                                    }
                                },
                                {
                                    "key": "balance-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91",
                                    "transform": {
                                        "WriteCLValue": {
                                            "bytes": "05006481d8e1",
                                            "cl_type": "U512",
                                            "parsed": "970000000000"
                                        }
                                    }
                                },
                                {
                                    "key": "balance-98d945f5324f865243b7c02c0417ab6eac361c5c56602fd42ced834a1ba201b6",
                                    "transform": "Identity"
                                },
                                {
                                    "key": "balance-79d3dfcf1309dadd0bb25c105b62a6651acfcd6b8984d95365cf388c66a902db",
                                    "transform": {
                                        "AddUInt512": "1000000000"
                                    }
                                },
                                {
                                    "key": "uref-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91-000",
                                    "transform": {
                                        "WriteCLValue": {
                                            "bytes": "",
                                            "cl_type": "Unit",
                                            "parsed": null
                                        }
                                    }
                                },
                                {
                                    "key": "deploy-c51ce21e9d124bb6a9944ef4855ff42790297386c14632d8146c5ab0ee88a8ed",
                                    "transform": {
                                        "WriteDeployInfo": {
                                            "deploy_hash": "c51ce21e9d124bb6a9944ef4855ff42790297386c14632d8146c5ab0ee88a8ed",
                                            "from": "account-hash-72dead79e8c78f3048cc9894e9ede95c5bfec4659edc269285edbe2023369272",
                                            "gas": "235844850",
                                            "source": "uref-4dbdee16446c4550f1a1d53df45a9be2f098efb548c1b1ec13f7edaca02cb666-007",
                                            "transfers": [
                                                "transfer-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91"
                                            ]
                                        }
                                    }
                                },
                                {
                                    "key": "transfer-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91",
                                    "transform": {
                                        "WriteTransfer": {
                                            "amount": "970000000000",
                                            "deploy_hash": "c51ce21e9d124bb6a9944ef4855ff42790297386c14632d8146c5ab0ee88a8ed",
                                            "from": "account-hash-72dead79e8c78f3048cc9894e9ede95c5bfec4659edc269285edbe2023369272",
                                            "gas": "0",
                                            "id": null,
                                            "source": "uref-4dbdee16446c4550f1a1d53df45a9be2f098efb548c1b1ec13f7edaca02cb666-007",
                                            "target": "uref-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91-007",
                                            "to": null
                                        }
                                    }
                                },
                                {
                                    "key": "balance-4dbdee16446c4550f1a1d53df45a9be2f098efb548c1b1ec13f7edaca02cb666",
                                    "transform": {
                                        "WriteCLValue": {
                                            "bytes": "0500e288c006",
                                            "cl_type": "U512",
                                            "parsed": "29000000000"
                                        }
                                    }
                                },
                                {
                                    "key": "hash-93d923e336b20a4c4ca14d592b60e5bd3fe330775618290104f9beb326db7ae2",
                                    "transform": "Identity"
                                },
                                {
                                    "key": "hash-8cf5e4acf51f54eb59291599187838dc3bc234089c46fc6ca8ad17e762ae4401",
                                    "transform": "Identity"
                                },
                                {
                                    "key": "hash-010c3fe81b7b862e50c77ef9a958a05bfa98444f26f96f23d37a13c96244cfb7",
                                    "transform": "Identity"
                                }
                            ]
                        },
                        "transfers": [
                            "transfer-3609cd6e95fea10bcbabdcc414c1dd7b9cdcd50c00193e78b3863becda289c91"
                        ]
                    }
                }
            }
        ]
    }
}
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

example: http://18.157.183.184:3030/info/get-list-deploys?id=13&b=3207ff3e5d94984a6ab8de908764f8a2c8b4acbcc1ed5970b26728ac2b2b4490

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

### State

#### query-state

```
url: /sate/query-state?id=&s=&k=

example: http://18.157.183.184:3030/state/query-state?id=12&s=97d55e7074133c9bf7ff1d7b1c9c6f5f84bff888bf0087f16d139356d334170f&k=01aea113d82a9d562563a2802b1abee7ac1ea40b6c100ddeda8e9be5666e1319dc

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

example: http://18.157.183.184:3030/state/get-balance/01aea113d82a9d562563a2802b1abee7ac1ea40b6c100ddeda8e9be5666e1319dc

method: GET

des: Retrieves a purse's balance from the network

2.
url: /state/get-balance?id=&s=&p=

example: http://18.157.183.184:3030/state/get-balance?id=12&s=97d55e7074133c9bf7ff1d7b1c9c6f5f84bff888bf0087f16d139356d334170f&p=uref-52d2021cafe721b5b114c3e45852178541e32ea1a904f904761a66d3dc804da0-007

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

example: http://18.157.183.184:3030/state/get-auction-info

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

example: http://18.157.183.184:3030/stateget-validators/3

method: GET

des: Return the number of top validator by total stake


successResponse:

{
    "block_height": 26868,
    "total_active_validators": 100,
    "total_bid_validators": 793,
    "total_stake": 1448369395576771,
    "era_validators": [
        {
            "era_id": 347,
            "validators": [
                {
                    "public_key": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e",
                    "bid": {
                        "staked_amount": "84233389535392",
                        "delegation_rate": 10
                    }
                },
                {
                    "public_key": "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca",
                    "bid": {
                        "staked_amount": "84233126725902",
                        "delegation_rate": 10
                    }
                },
                {
                    "public_key": "01a854ee50171a515aa9b0214fbc8b3438ff9100e8b1411a8dce432aa68ea5f73a",
                    "bid": {
                        "staked_amount": "1447726537285",
                        "delegation_rate": 10
                    }
                }
            ]
        },
        {
            "era_id": 348,
            "validators": [
                {
                    "public_key": "017d96b9a63abcb61c870a4f55187a0a7ac24096bdb5fc585c12a686a4d892009e",
                    "bid": {
                        "staked_amount": "84233389535392",
                        "delegation_rate": 10
                    }
                },
                {
                    "public_key": "0106ca7c39cd272dbf21a86eeb3b36b7c26e2e9b94af64292419f7862936bca2ca",
                    "bid": {
                        "staked_amount": "84233126725902",
                        "delegation_rate": 10
                    }
                },
                {
                    "public_key": "01a854ee50171a515aa9b0214fbc8b3438ff9100e8b1411a8dce432aa68ea5f73a",
                    "bid": {
                        "staked_amount": "1447726537285",
                        "delegation_rate": 10
                    }
                }
            ]
        }
    ]
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



