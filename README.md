# casperstats-backend

This project provide the REST api to interact with Casper blockchain

# Table of contents

- [Quick Start](#quick-start)
  - [Requirements](#requirements)
  - [Reference](#reference)
  - [Installation](#installation)
- [API](#API)
  - [new_address](#new_address)

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

example: localhost:3000/api/block

method: GET

request: 
{
    
}

successResponse:
{
    {
    "id": -6025693843983172000,
    "jsonrpc": "2.0",
    "result": {
        "api_version": "1.0.0",
        "block": {
            "body": {
                "deploy_hashes": [],
                "proposer": "0189da179d3ae3fc8f0975da77851d11226bfda3327ef17e343d9112aa71426cb6",
                "transfer_hashes": []
            },
            "hash": "e6a6fcc0a3dda646085bb20736d9fdd25e498fb654d12a279c9a453f42e088d3",
            "header": {
                "accumulated_seed": "5931ca3b180325bf3bcede27dcd3d1decf97b9521ebc0ebaf75629dbc8723dae",
                "body_hash": "e9c15df4d693cd5d3502a6028858e59d2443e672066c4abab88936ad9e328e4a",
                "era_end": null,
                "era_id": 126,
                "height": 9017,
                "parent_hash": "f0303c65ba35b7549e734f3ba34b439b43181d577485973c01e4fbec771869a7",
                "protocol_version": "1.0.0",
                "random_bit": true,
                "state_root_hash": "ba3ea6afd5f82330432b758a30435f67b51e9bf71d13db1a94974ae1f4b1713b",
                "timestamp": "2021-04-19T08:26:32.320Z"
            },
            "proofs": [
                {
                    "public_key": "010268bb35bd370a499ba775877aaadef1ba87bff64ca527ae55f88cd8af9791de",
                    "signature": "130 chars"
                },
                {
                    "public_key": "0105220d6629f6ef4484e2da5f58b6222832af8cabba4fbd7f1ad55e84a06ab319",
                    "signature": "130 chars"
                }
            ]
        }
    }
}
}
```

| ResponseField  | Type | Description |
| ------------- | ------------- | ------------- |
|  |  |  |
|  |  |  |

