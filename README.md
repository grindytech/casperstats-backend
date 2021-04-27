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
    - [get-latest-block](#get-latest-block)
    - [get-transactions](#get-transactions)

  - [Info](#Info)
    - [get-deploy](#get-deploy)
    - [get-list-deploys](#get-list-deploys)

  - [State](#State)
    - [query-state](#query-state)
    - [get-balance](#get-balance)

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
url: /chain/get-block?id=&b=

example: http://18.197.228.151:3030/chain/get-block?id=13&b=69

method: GET


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
url: /chain/get-block-tranfers?id=&b=

example: http://18.197.228.151:3030/chain/get-block-tranfers?id=13&b=888583776321623143121e6fc1209f4ed01601696a6ba857fc5fbdbe41a3a3d2

method: GET


successResponse:
{
    "id": 13,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "block_hash": "8eec00f58216737005c26b4fab8b362ad494501c0f5301f66d47a080b8fd98bf",
        "transfers": [
            {
                "amount": "999000000000",
                "deploy_hash": "d3332cfabae9bf4333916565df47da89c3cd6b833ca76a55a8fc4a5ed32ea46a",
                "from": "account-hash-b6bb3f6a2ce576d9f571785976b8bbbd981f08a7ea59afd70cf0482685ffc1ea",
                "gas": "0",
                "id": null,
                "source": "uref-8f1be39ceb3fe9460d85cb1e477053710be6c6d847071f94b7b5653adb2a4498-007",
                "target": "uref-39f00d08b5a409ef5f2e8d04023f9433894975df46da548d50b866a1460d2960-007",
                "to": null
            }
        ]
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


#### get-state-root-hash

```
url: /chain/get-state-root-hash?id=&b=

example: http://18.197.228.151:3030/chain/get-state-root-hash?id=12&b=

method: GET


successResponse:
{
    "id": 12,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "state_root_hash": "58b64aca9e35a2985b094d451674d1f4c00836abfea8886fb9939b83eb8c8674"
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


#### get-latest-block

```
url: /chain/get-latest-block?id=

example: http://18.197.228.151:3030/chain/get-latest-block

method: GET

des: Get data of the latest block

successResponse: block data

```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| id | number | JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned | Optional |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |

#### get-transactions

```
url: /chain/get-transactions?id=&b=

example: http://18.197.228.151:3030/chain/get-transactions?b=11660

method: GET

des: get the information data by block

successResponse:
{
[
    {
        "amount": "98000000000",
        "deploy_hash": "f121d85da45d3e2adb57b235b0016a87e00428b62b9203ca532f085fb252deb8",
        "from": "account-hash-519f5a3516902da1b9e253337f15cc299fe8ad643f1c6d24ef6107782f764f60",
        "gas": "0",
        "id": null,
        "source": "uref-cf46c061bcab28c046b39721e6a8f6fd6444e0025f65ed2898eefebb3372040c-007",
        "target": "uref-e81b4fffcd8fd5ff94bf22fb80667522504b23ec8e0a3d8db1ca0515b43b554f-004",
        "to": "account-hash-edb9b5d9590bb1d48bd13d178dc7cf3b385f10986754865441e0e957be20eaed"
    },
    {
        "amount": "98000000000",
        "deploy_hash": "34c23da9e172029cf57e52f21758422371d080e96972916ddb67171ee2d3c443",
        "from": "account-hash-d1fc6c1d372cc2e390d63964c47f99dd6556f4b322c540d6eeed73aaf012e882",
        "gas": "0",
        "id": null,
        "source": "uref-9382f1299d508d62dba7187d0965d41c486782786657160079e567c4dce71b8e-007",
        "target": "uref-e81b4fffcd8fd5ff94bf22fb80667522504b23ec8e0a3d8db1ca0515b43b554f-004",
        "to": "account-hash-edb9b5d9590bb1d48bd13d178dc7cf3b385f10986754865441e0e957be20eaed"
    }
]
}

```

| Params  | Type | Description | Required |
| ------------- | ------------- | ------------- |------------- |
| id | number | JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned | Optional |
| b | string, number |  Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used | Optional |

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |



### Info

#### get-deploy

```
url: /info/get-deploy?id=&hex=

example: http://18.197.228.151:3030/info/get-deploy?id=13&hex=c51ce21e9d124bb6a9944ef4855ff42790297386c14632d8146c5ab0ee88a8ed

method: GET


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

example: http://18.197.228.151:3030/info/get-list-deploys?id=13&b=3207ff3e5d94984a6ab8de908764f8a2c8b4acbcc1ed5970b26728ac2b2b4490

method: GET


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

example: http://18.197.228.151:3030/state/query-state?id=12&s=97d55e7074133c9bf7ff1d7b1c9c6f5f84bff888bf0087f16d139356d334170f&k=01aea113d82a9d562563a2802b1abee7ac1ea40b6c100ddeda8e9be5666e1319dc

method: GET

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

example: http://18.197.228.151:3030/state/get-balance/01aea113d82a9d562563a2802b1abee7ac1ea40b6c100ddeda8e9be5666e1319dc

method: GET

2.
url: /state/get-balance?id=&s=&p=

example: http://18.197.228.151:3030/state/get-balance?id=12&s=97d55e7074133c9bf7ff1d7b1c9c6f5f84bff888bf0087f16d139356d334170f&p=uref-52d2021cafe721b5b114c3e45852178541e32ea1a904f904761a66d3dc804da0-007

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
