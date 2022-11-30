const { casper_sequelize } = require("../service/common");
const Sequelize = require("sequelize");
const { Op } = Sequelize;

const Block = casper_sequelize.define(
  "block",
  {
    hash: {
      type: Sequelize.STRING(64),
      primaryKey: true,
      allowNull: false,
    },
    height: {
      type: Sequelize.INTEGER,
      unique: true,
    },
    timestamp: {
      type: Sequelize.STRING(25),
    },
    deploy_hashes: {
      type: Sequelize.INTEGER,
    },
    transfer_hashes: {
      type: Sequelize.INTEGER,
    },
    era: {
      type: Sequelize.INTEGER,
    },
    parent_hash: {
      type: Sequelize.STRING(64),
    },
    state_root_hash: {
      type: Sequelize.STRING(64),
    },
    validator: {
      type: Sequelize.STRING(68),
    },
  },
  {
    timestamps: false,
  }
);

async function getBlocksByValidator(validator_public_key, start, count) {
  return await Block.findAll({
    where: {
      validator: {
        [Op.eq]: validator_public_key,
      },
    },
    order: [["height", "DESC"]],
    offset: start,
    limit: count,
  });
}

//`SELECT era , MAX(height) as height FROM block WHERE DATE(timestamp) BETWEEN '${date}' AND '${date}' GROUP BY era ORDER BY height DESC`
async function GetSwitchBlockByDate(date) {
  return await Block.findAll({
    attributes: [
      "era",
      [Sequelize.fn("MAX", Sequelize.col("height")), "height"],
    ],
    where: {
      [Sequelize.fn("DATE", Sequelize.col("timestamp"))]: {
        [Op.between]: [date, date],
      },
    },
    group: "era",
    order: [["height", "DESC"]],
  });
}

// `SELECT * FROM block WHERE height = '${height}'`;
async function getBlockByHeight(height) {
  return await Block.findAll({
    where: {
      height: {
        [Op.eq]: height,
      },
    },
  });
}

//`SELECT height FROM block WHERE hash = '${hash}'`;
async function getBlockHeightByHash(hash) {
  return await Block.findAll({
    attributes: ["height"],
    where: {
      hash: {
        [Op.eq]: hash,
      },
    },
  });
}

//`SELECT * FROM block ORDER BY height DESC LIMIT 0, ${count}`;
async function getLatestBlock(count) {
  return await Block.findAll({
    order: [["height", "DESC"]],
    offset: 0,
    limit: count,
  });
}

async function getRangeBlock(start, size) {
  return await Block.findAll({
    order: [["height", "DESC"]],
    offset: start,
    limit: size,
  });
}

//`SELECT MAX(height) as height FROM block`;
async function getBlockHeight() {
  try {
    const height = await Block.findAll({
      attributes: [[Sequelize.fn("MAX", Sequelize.col("height")), "height"]],
    });

    if (height != undefined && height.length > 0) {
      return height[0].height;
    } else {
      return -1;
    }
  } catch (err) {
    return false;
  }
}

//`SELECT era FROM block WHERE hash = '${hash}'`;
async function getEraByBlockHash(hash) {
  try {
    const era = await Block.findAll({
      attributes: ["era"],
      where: {
        hash: {
          [Op.eq]: hash,
        },
      },
    });

    if (era != undefined && era.length > 0) {
      return era[0].era;
    } else {
      return -1;
    }
  } catch (err) {
    return false;
  }
}

// `SELECT timestamp FROM block WHERE height = (SELECT MIN(height) AS height FROM block WHERE era = ${era})`;
async function getTimestampByEraFromSwtichBlock(era) {
  try {
    const timestamp = await Block.findAll({
      attributes: ["timestamp"],
      where: {
        height: {
          [Op.eq]: Block.findAll({
            attributes: [
              [Sequelize.fn("MIN", Sequelize.col("height")), "height"],
            ],
            where: {
              era: {
                [Op.eq]: era,
              },
            },
          }),
        },
      },
    });

    if (timestamp != undefined && timestamp != null && timestamp.length > 0) {
      return timestamp[0].timestamp;
    } else {
      return null;
    }
  } catch (err) {
    return false;
  }
}

module.exports = {
  Block,
  getBlocksByValidator,
  GetSwitchBlockByDate,
  getBlockByHeight,
  getBlockHeight,
  getEraByBlockHash,
  getTimestampByEraFromSwtichBlock,
  getBlockHeightByHash,
  getRangeBlock,
  getLatestBlock,
};
