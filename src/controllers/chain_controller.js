const {
  getBlocksByValidator,
  getBlockHeight,
  getBlockByHeight,
  getRangeBlock,
  getLatestBlock,
} = require("../models/block_model");
const {
  getTotalNumberOfTransfers,
  getTransfers,
  getTransfersByDeployHash,
} = require("../models/transfer");
const { getAllDeployByHash } = require("../models/deploy");
const {
  getDeployhashes,
  getDeploy,
  getBlock,
  getTransfersInBlock,
  getDeploysInBlock,
} = require("../service/chain");
const common = require("../service/common");
const { requestRPC, getNetWorkRPC } = require("../service/common");
const { RpcApiName } = require("../service/constant");

const NodeCache = require("node-cache");
const {
  getDeployUpdateTime,
  getBlockUpdateTime,
} = require("../models/timestamp");
const get_block_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_BLOCK || 20,
});
const get_block_deploys_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_BLOCK_DEPLOYS || 20,
});
const get_block_transfers_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_BLOCK_TRANSFERS || 20,
});
const get_latest_block_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_LATEST_BLOCKS || 60,
});
const get_latest_tx_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_LATEST_BLOCKS || 50,
});
let deploy_timestamp;
let block_timestamp;

require("dotenv").config();

async function getLatestBlocksCache(num) {
  let datas;
  try {
    let timestamp = await getBlockUpdateTime();

    if (get_latest_block_cache.has(`'${num}'-'${timestamp}'`)) {
      block_timestamp = timestamp;
      return (datas = get_latest_block_cache.get(`'${num}'-'${timestamp}'`));
    }

    datas = await getLatestBlock(num);
    get_latest_block_cache.set(`'${num}'-'${timestamp}'`, datas);
    block_timestamp = timestamp;
  } catch (err) {
    console.log(err);
  }

  return datas;
}

async function getLatestTxCache(start, count) {
  let result;

  try {
    let timestamp = await getDeployUpdateTime();
    if (get_latest_tx_cache.has(`'${start}'-'${count}'-'${timestamp}'`)) {
      deploy_timestamp = timestamp;
      return (result = get_latest_tx_cache.get(
        `'${start}'-'${count}'-'${timestamp}'`
      ));
    }
    result = await getTransfers(start, count);

    for (let i = 0; i < result.length; i++) {
      if (result[i].to_address === "null") {
        result[i].to_address = null;
      }
    }
    get_latest_tx_cache.set(`'${start}'-'${count}'-'${timestamp}'`, result);
    get_latest_tx_cache.del(`'${start}'-'${count}'-'${deploy_timestamp}'`);
    deploy_timestamp = timestamp;
  } catch (err) {
    console.log(err);
  }

  return result;
}

module.exports = {
  get_block_cache,
  get_block_deploys_cache,
  get_block_transfers_cache,
  get_latest_block_cache,
  get_latest_tx_cache,
  getLatestBlocksCache,
  getLatestTxCache,

  getBlock: async function (req, res) {
    const b = req.params.block; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used
    const url = await getNetWorkRPC();
    const height = await getBlockHeight();

    // Check valid block input
    if (isNaN(b)) {
      if (b.length != 64) {
        res.send({
          code: -32001,
          message: "block not known",
          data: null,
        });
        return;
      }

      params = [{ Hash: b }];
    } else {
      if (parseInt(b) < 0 || parseInt(b) > height) {
        res.send({
          code: -32001,
          message: "block not known",
          data: null,
        });
        return;
      }
      params = [{ Height: parseInt(b) }];
    }
    requestRPC(url, RpcApiName.get_block, params)
      .then((value) => {
        value.result["current_height"] = height;
        get_block_cache.set(b, value);
        res.status(200).json(value);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Can not get block data");
      });
  },

  getBlockTx: async function (req, res) {
    const b = req.params.block; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

    let params;
    // check b is a number or string to change the params
    if (isNaN(b)) {
      params = [{ Hash: b }];
    } else {
      params = [{ Height: parseInt(b) }];
    }
    let hash;
    if (isNaN(b)) {
      hash = b;
    } else {
      hash = (await getBlockByHeight(b)).hash;
    }
    // const url = await getNetWorkRPC();
    // requestRPC(url, RpcApiName.get_block_transfers, params).then(value => {
    //   res.status(200);
    //   res.json(value.result.transfers);
    // }).catch(err => {
    //   console.log(err);
    //   res.status(500).send("Can not get tx data");
    // })

    let transfers = [];
    try {
      const deploy_hash = await getAllDeployByHash(hash);
      if (deploy_hash.length > 0) {
        for (let i = 0; i < deploy_hash.length; i++) {
          const transfer = await getTransfersByDeployHash(
            deploy_hash[i].deploy_hash
          );
          if (transfer != null) {
            if (transfer.from) {
              transfer.from = "account-hash-" + transfer.from;
            }
            if (transfer.to) {
              transfer.to = "account-hash-" + transfer.to;
            }
            transfers.push(transfer);
          }
        }
      }
      get_block_transfers_cache.set(b, transfers);
      res.status(200);
      res.json(transfers);
    } catch (err) {
      console.log(err);
      res.status(500).send("can not get block_transfer");
    }
  },

  GetStateRootHash: async function (req, res) {
    let b = req.params.block; // Hex-encoded block hash or height of the block. If not given, the last block added to the chain as known at the given node will be used

    let params;

    // check b is a number or string to change the params
    if (isNaN(b)) {
      params = [{ Hash: b }];
    } else {
      params = [{ Height: parseInt(b) }];
    }
    const url = await getNetWorkRPC();
    requestRPC(url, RpcApiName.get_state_root_hash, params)
      .then((value) => {
        res.status(200);
        res.json(value);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send("Can not get state_root_hash");
      });
  },

  getLatestBlocks: async function (req, res) {
    let num = req.params.number; // Number of block

    try {
      let datas;
      if (get_latest_block_cache.has(`'${num}'-'${block_timestamp}'`)) {
        datas = get_latest_block_cache.get(`'${num}'-'${block_timestamp}'`);
      } else {
        datas = await getLatestBlocksCache(num);
      }

      res.status(200);
      res.json(datas);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get latest block");
    }
  },

  getRangeBlock: async function (req, res) {
    let page = Number(req.query.page);
    let size = Number(req.query.size);

    try {
      let height = await getBlockHeight();
      const data = common.pagination;
      data.currentPage = page;
      data.total = height;
      data.size = size;

      // Get total pages
      let totalPages = Math.ceil(Number(height) / size);
      data.pages = Number(totalPages);

      // check if current page has next page and previous page
      const check = common.checkNextAndPreviousPage(page, totalPages);
      data.hasNext = check.hasNext;
      data.hasPrevious = check.hasPrevious;

      // get range blocks
      let start = Number(size * (page - 1));
      let block_data = await getRangeBlock(start, size);
      data.items = block_data;

      res.status(200);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get block by range");
    }
  },

  getBlockDeployTx: async function (req, res) {
    const b = req.params.block;
    let hash;
    try {
      if (isNaN(b)) {
        hash = b;
      } else {
        hash = (await getBlockByHeight(b)).hash;
      }
      const url = await getNetWorkRPC();
      let deploy_hashes = await getDeployhashes(url, b);
      //let deploy_hashes = await getAllDeployByHash(hash); //edited
      console.log(deploy_hashes);
      let data = [];
      for (let i = 0; i < deploy_hashes.length; i++) {
        let deploy_data = await getDeploy(deploy_hashes[i]);
        data.push(deploy_data);
      }
      get_block_deploys_cache.set(b, data);
      res.status(200);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get block tx data");
    }
  },

  countTransfers: async function (req, res) {
    getTotalNumberOfTransfers()
      .then((value) => {
        if (value.length === 1) {
          res.json(value[0]);
        } else {
          res.json({});
        }
      })
      .catch((err) => {
        res.send(err);
      });
  },

  getLatestTx: async function (req, res) {
    try {
      const start = req.query.start;
      const count = req.query.count;
      let result;
      if (
        get_latest_tx_cache.has(`'${start}'-'${count}'-'${deploy_timestamp}'`)
      ) {
        result = get_latest_tx_cache.get(
          `'${start}'-'${count}'-'${deploy_timestamp}'`
        );
      } else {
        result = await getLatestTxCache(start, count);
      }

      res.status(200);
      res.json(result);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not latest txs");
    }
  },

  getBlocksByProposer: async function (req, res) {
    const validator = req.query.validator;
    const start = Number(req.query.start);
    const count = Number(req.query.count);

    try {
      //const url = await getNetWorkRPC();
      let data = await getBlocksByValidator(validator, start, count);

      for (let i = 0; i < data.length; i++) {
        delete data[i]["parent_hash"];
        delete data[i]["state_root_hash"];
        delete data[i]["validator"];

        // const deploys = await getDeploysInBlock(url, data[i].height);
        // const transfers = await getTransfersInBlock(url, data[i].height);
        // data[i]["deploys"] = deploys.deploy_hashes.length + deploys.transfer_hashes.length;
        // data[i]["transfers"] = transfers.transfers.length;
      }
      res.status(200);
      res.json(data);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get block proposer");
    }
  },

  getStatus: async function (req, res) {
    try {
      const url = await getNetWorkRPC();
      const status = await common.requestRPC(url, RpcApiName.get_status, []);
      res.json(status).status(200);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get network status");
    }
  },

  getNetworkRPC: async function (req, res) {
    try {
      const rpc = await common.getNetWorkRPC();
      res.json(rpc);
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get network rpc");
    }
  },

  getBlockTime: async function (req, res) {
    try {
      const url = await getNetWorkRPC();
      let current_height = 0;
      let current_timestamp = 0;
      {
        const params = [];
        const block_data = await requestRPC(url, RpcApiName.get_block, params);
        current_height = block_data.result.block.header.height;
        current_timestamp = new Date(
          block_data.result.block.header.timestamp
        ).getTime();
      }
      let last_timestamp = 0;
      {
        params = [{ Height: Number(current_height) - 1 }];
        const block_data = await requestRPC(url, RpcApiName.get_block, params);
        last_timestamp = new Date(
          block_data.result.block.header.timestamp
        ).getTime();
      }

      const block_time = current_timestamp - last_timestamp;

      res.status(200).json({
        current_block: current_height,
        next_block: Number(current_height) + 1,
        block_time: block_time,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send("Can not get block time");
    }
  },
};
