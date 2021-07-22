const router = require("express").Router();
const validator_controller = require("../controllers/validator_controller");
const { auth } = require("../utils/common");

function authentication_required(req, res, next) {
    if (req.headers.authorization && req.headers.authorization.search('Basic ') === 0) {
        var header = new Buffer.from(req.headers.authorization.split(' ')[1], 'base64').toString();
        var headerSplit = header.split(':');
        var username = headerSplit[0];
        var password = headerSplit[1];

        if (username && password && (username.length >= 4 && password.length >= 2)) {
            if (auth(username, password)) {
                next(); return;
            } else {
                res.status(401).send('Authentication required');
            }
        }
    } else {
        res.header('WWW-Authenticate', 'Basic realm="Login with username/password"');
        res.status(401).send('Authentication required');
    }
}

router.route("/get-validators").get(validator_controller.GetValidators);

router.route("/add").post(authentication_required, validator_controller.AddValidator);
router.route("/delete/:address").get(validator_controller.DeleteValidator);
router.route("/get-validator/:address").get(validator_controller.GetValidator);
router.route("/init").get(authentication_required, validator_controller.Init);
router.route("/drop").get(authentication_required, validator_controller.Drop);

module.exports = router;
