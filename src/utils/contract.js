import axios from "axios";
import {
    CasperClient, CasperServiceByJsonRPC,
    CLValue, DeployUtil,
    PublicKey, RuntimeArgs,
    Signer
} from "casper-client-sdk";

export class Stake {

    casperClient = new CasperClient(process.env.RPC_API);
    deployService = new CasperServiceByJsonRPC(process.env.API);

    /**
     * Adds two numbers.
     * @param {String} delegator the delegator public key.
     * @param {String} validator the validator public key.
     * @param {Number} amount the number of CSPR token will be delegated (decimals = 9).
     * @param {String} fee the fee (decimals = 9).
     * @return {String} deploy hash.
     */
    async make_delegate(delegator, validator, amount, fee) {
        // networkName can be taken from the status api
        let networkName = null;
        {
            const response = await axios.get(process.env.API + "chain/status");
            if (response.status == 200) {
                networkName = response.data.chainspec_name;
            }
        }

        if (networkName == null) {
            return;
        }

        // Time that the deploy will remain valid for, in milliseconds
        // The default value is 1800000 ms (30 minutes)
        let sessionArgs;
        let deployParams;
        {
            const ttl = 1800000;
            const gasPrice = 1;

            const delegator_public_key = PublicKey.fromHex(delegator.toString());
            deployParams = new DeployUtil.DeployParams(
                delegator_public_key,
                networkName,
                gasPrice,
                ttl
            );

            const validator_public_key = PublicKey.fromHex(validator.toString());

            sessionArgs = RuntimeArgs.fromMap({
                delegator: CLValue.publicKey(delegator_public_key),
                validator: CLValue.publicKey(validator_public_key),
                amount: CLValue.u512(amount),
            });
        }

        let contract_bytes;
        {
            const response = await axios.get(
                process.env.API + "contract/get-contract?name=delegate"
            );
            contract_bytes = response.data.contract_bytes.data;
        }

        const session = DeployUtil.ExecutableDeployItem.newModuleBytes(
            contract_bytes,
            sessionArgs
        );

        const payment = DeployUtil.standardPayment(fee.toString());
        const deploy = DeployUtil.makeDeploy(deployParams, session, payment);

        return deploy;
    }

    async checkConnectionToSigner() {
        try {
            let connected = await Signer.isConnected();
            return connected;
        } catch (err) {
            // console.error(err);
            return false;
        }
    }

    async delegate() {
        let connected = await this.checkConnectionToSigner();

        if (!connected) {
            throw new Error(
                "Please install/connect the CasperLabs Signer extension first!"
            );
        }

        const publicKeyBase64 = await Signer.getActivePublicKey();

        const deploy_delegate = await this.make_delegate(
            publicKeyBase64,
            "0167e08c3b05017d329444dc7d22518ba652cecb2c54669a69e5808ebcab25e42c",
            "5000000000",
            "3000000000"
        );
        console.log("deploy_delegate: ", deploy_delegate);


        let signature;
        {
            const deploy_delegate_json = DeployUtil.deployToJson(deploy_delegate);
            const signed_message = await Signer.sign(
                deploy_delegate_json,
                publicKeyBase64,
                publicKeyBase64
            );
            signature = signed_message.deploy.approvals[0].signature;
        }

        // console.log("approvals: ", approvals);

        let message = DeployUtil.setSignature(
            deploy_delegate,
            signature,
            PublicKey.fromHex(publicKeyBase64)
        );
        message.approvals[0].signature = signature;

        console.log("message: ", message);

        const result = await this.deployService.deploy(message).catch(err => {
            console.log("err: ", err);
        })

        return result;
    }

    async undelegate() { }

    async transfer() { }
}