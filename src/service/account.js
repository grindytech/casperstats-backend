const dotenv = require("dotenv");
dotenv.config();
const { RpcApiName } = require("./constant");
const common = require("./common");
const { GetAccounts } = require("../models/account");
const math = require("mathjs");
const { getAllDeployOfPublicKeyByType } = require("../models/deploy");
const { getDeployByRPC } = require("./chain");
const { getEraByBlockHash } = require("../models/block_model");
const { getAllKnownAddress } = require("../models/address");
const {
  getInflowOfAddressByDate,
  getOutflowOfAddressByDate,
} = require("../models/transfer");
const { getAddress } = require("../models/address");
const { getValidatorInformation } = require("./validator");
const { getAllValidator } = require("../models/validator");
const { getAllDelegator } = require("../models/delegator");
const { getLatestEra } = require("../models/era_id");
const NodeCache = require("node-cache");
const get_all_accounts_cache = new NodeCache({
  stdTTL: process.env.CACHE_GET_RICH_ACCOUNTS || 3600,
});

async function getAccountData(address) {
  let account_hash = "";
  let public_key = null;
  if (address.includes("account-hash-")) {
    // account hash
    account_hash = address;
    public_key = null;
  }
  // try to get account hash if it's publickey otherwise it's an account hash
  else
    try {
      account_hash = await common.getAccountHash(address);
      console.log("account hash: " + account_hash);
      account_hash = "account-hash-" + account_hash.replace(/\n/g, "");
      public_key = address;
    } catch (err) {
      account_hash = "account-hash-" + address;
      public_key = null;
    }
  const account = {
    account_hash: account_hash.replace("account-hash-", ""),
    public_key_hex: public_key,
    active_date: "",
  };
  return account;
}

async function getRichestCache() {
  let result = [];
  {
    // get all accounts
    const accounts = await GetAccounts();
    let stakers = []; // stake order
    {
      // get all staking accounts
      const auction_info = await getAllValidator();

      for (let i = 0; i < auction_info.length; i++) {
        stakers.push({
          public_key_hex: auction_info[i].public_key_hex,
          staked_amount: auction_info[i].self_stake.toString(),
        });
      }

      const delegators = await getAllDelegator();
      for (let j = 0; j < delegators.length; j++) {
        stakers.push({
          public_key_hex: delegators[j].public_key,
          staked_amount: delegators[j].staked_amount.toString(),
        });
      }
    }

    // merge stakers to accounts
    for (let i = 0; i < accounts.length; i++) {
      const public_key_hex = accounts[i].public_key_hex;
      let staked_amount = 0;
      const transferrable =
        accounts[i].balance === null ? 0 : accounts[i].balance;
      const filter_pk = stakers.filter((value) => {
        return value.public_key_hex == public_key_hex;
      });

      for (let j = 0; j < filter_pk.length; j++) {
        staked_amount += Number(filter_pk[j].staked_amount);
      }
      let total_balance = Number(transferrable) + Number(staked_amount);
      if (!total_balance) {
        total_balance = 0;
      }
      accounts[i].balance = total_balance.toString();
      accounts[i].transferrable = transferrable.toString();
      accounts[i].staked_amount = staked_amount.toString();

      // remove account that just merge from stakers
      stakers = stakers.filter((value) => {
        return value.public_key_hex != public_key_hex;
      });
    }
    //result = accounts.concat(stakers);
    result = accounts;
  }

  result.sort((first, second) => {
    let first_balance = first.balance;
    if (!first_balance) {
      first_balance = first.staked_amount;
    }

    let second_balance = second.balance;
    if (!second_balance) {
      second_balance = second.staked_amount;
    }
    return math.compare(second_balance, first_balance);
  });

  get_all_accounts_cache.set(`richest account`, result);

  return result;
}

async function getRichest(start, count) {
  let result = [];
  if (get_all_accounts_cache.has(`richest account`)) {
    let data = get_all_accounts_cache.get(`richest account`);
    result = data.slice(Number(start), Number(start) + Number(count));
  } else {
    //const url = await common.getNetWorkRPC();

    result = await getRichestCache();
    result = result.slice(Number(start), Number(start) + Number(count));
  }
  // add more information for genesis account
  // {
  //     for (let i = 0; i < result.length; i++) {
  //         if (result[i].account_hash == undefined) {
  //             result[i].account_hash = await common.getAccountHash(result[i].public_key_hex);

  //             result[i].active_date = "";
  //             result[i].transferrable = (await common.getBalanceByAccountHash(url, "account-hash-" + result[i].account_hash)).balance_value;
  //             result[i].balance = (Number(result[i].staked_amount) + Number(result[i].transferrable)).toString();
  //         }
  //     }
  // }
  return result;
}

async function getUnstakingAmount(url, public_key) {
  const deploys = await getAllDeployOfPublicKeyByType(public_key, "undelegate");
  const current_era = await getLatestEra();
  let total = 0;
  for (let i = 0; i < deploys.length; i++) {
    if (deploys[i].status == "success") {
      const era_of_creation = await getEraByBlockHash(deploys[i].hash);
      if (Number(era_of_creation) + 8 <= Number(current_era)) break;
      const deploy_data = await getDeployByRPC(url, deploys[i].deploy_hash);
      const args = deploy_data.result.deploy.session.StoredContractByHash.args;
      const amount = args.find((value) => {
        return value[0] == "amount";
      })[1].parsed;
      total += Number(amount);
    }
  }
  return total;
}

async function getDexAddressesTraffic(type, from, to) {
  let get_traffic;
  if (type == "in") {
    get_traffic = getInflowOfAddressByDate;
  } else {
    get_traffic = getOutflowOfAddressByDate;
  }
  let accounts = await getAllKnownAddress();
  let traffic_value = {};
  let total = 0;
  for (let i = 0; i < accounts.length; i++) {
    const amount = await get_traffic(accounts[i].account_hash, from, to);
    const cspr = Math.round(amount / Math.pow(10, 9));
    if (cspr > 0) {
      if (traffic_value[accounts[i].name]) {
        traffic_value[accounts[i].name].amount += Number(cspr);
      } else {
        traffic_value[accounts[i].name] = {};
        traffic_value[accounts[i].name]["amount"] = 0;
        traffic_value[accounts[i].name].amount += Number(cspr);
      }
      total += Number(cspr);
    }
  }

  let value = []; // turn to array
  for (var key in traffic_value) {
    let obj = traffic_value[key];
    const percentage = (obj.amount / total) * 100;
    value.push({
      name: key,
      amount: obj.amount,
      percentage: percentage,
    });
  }

  value.sort(function (a, b) {
    return b.amount - a.amount;
  });

  return {
    total,
    value,
  };
}

async function getExchangeVolumeByDate(date) {
  let accounts = await getAllKnownAddress();
  let in_total = 0;
  let out_total = 0;
  for (let i = 0; i < accounts.length; i++) {
    const in_amount = await getInflowOfAddressByDate(
      accounts[i].account_hash,
      date,
      date
    );
    in_total += Number(in_amount);
    const out_amount = await getOutflowOfAddressByDate(
      accounts[i].account_hash,
      date,
      date
    );
    out_total += Number(out_amount);
  }
  in_total = Math.round(in_total / Math.pow(10, 9));
  out_total = Math.round(out_total / Math.pow(10, 9));
  const timestamp = new Date(date).getTime();
  return [timestamp, in_total, out_total];
}

async function getAccountName(account) {
  let address_name = await getAddress(account);
  if (address_name && address_name.length > 0) {
    return address_name[0].name;
  }
  let validator_name = await getValidatorInformation(account);
  if (validator_name) {
    return validator_name.name;
  }
  return null;
}

function withoutTime(dateTime) {
  var date = new Date(dateTime.getTime());
  date.setHours(0, 0, 0, 0);
  return date;
}

module.exports = {
  getAccountData,
  getRichest,
  getUnstakingAmount,
  getDexAddressesTraffic,
  getAccountName,
  getExchangeVolumeByDate,
  withoutTime,
  getRichestCache,
};
