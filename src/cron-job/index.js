const account_cron = require('./account_cron');
const info_cron = require('./info_cron');
const state_cron = require('./state_cron');
const block_cron = require('./block_cron');
const transfer_cron = require('./transfer_cron');
const validator_cron = require('./validator_cron');


async function start(){
    // block_cron
    block_cron.start();

    // transfer_cron
    transfer_cron.start();

    // account_cron
    account_cron.start();

    // state_cron
    state_cron.start();

    // info_cron
    info_cron.start();

    // validator_cron
    validator_cron.start();
}
module.exports = { start }