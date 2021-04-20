
const dotenv = require("dotenv");
dotenv.config();

const { exec } = require("child_process");

const Execute = async (command) => {
    return new Promise((resolve, reject) => {

        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error)
                return;
            }
            if (stderr) {
                reject(stderr);
                return;
            }
            resolve(JSON.parse(stdout));
        });
    })
}



module.exports = { Execute }
