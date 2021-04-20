# casperstats-backend

This project provide the REST api to interact with Casper blockchain

# Table of contents

- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Reference](#reference)
  - [Installation](#installation)
- [API](#API)
  - [get_block](#get_block)

## Quick Start

### Requirements

OS: Unix

Development environment: NodeJs


### Reference
- [casper-client](https://crates.io/crates/casper-client)


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

### get_block

```
url: /api/block

example: localhost:3000/api/block?id=13&b=69

method: GET

params: 
id: JSON-RPC identifier, applied to the request and returned in the response. If not provided, a random integer will be assigned
b: Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

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

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |

