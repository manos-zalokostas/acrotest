const Crypto = require("crypto");

module.exports = {

    uuid() {
        const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },


    /*******************************
     *
     NODE JS METHODS  BELLOW

     */


    base64(value) {
        let buff = new Buffer(value);
        return buff.toString('base64');
    },


    unbase64(hash) {
        let buff = new Buffer(hash, 'base64');
        return buff.toString('ascii');
    },


    sha256(value) {
        return Crypto.createHash("sha256")
            .update(value)
            .digest("hex");
    },


    // bcrypt() {
    //     const bcrypt = require('bcrypt');
    //     const saltRounds = 10;
    //     const myPlaintextPassword = 's0/\/\P4$$w0rD';
    //     const someOtherPlaintextPassword = 'not_bacon';
    // }

}
