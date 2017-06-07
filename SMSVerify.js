// This mem-cache module is a local in-memory cache - for production use, you would replace this with Memcache, Redis, or a database
const Cache = require('mem-cache');
const cache = new Cache();

function SMSVerify(twilioClient, sendingPhoneNumber, appHash) {
    this.twilioClient = twilioClient;
    this.sendingPhoneNumber = sendingPhoneNumber;
    this.appHash = appHash;
};

module.exports = SMSVerify;

SMSVerify.prototype.generateOneTimeCode = function() {
    const codelength = 6;
    return Math.floor(Math.random() * (Math.pow(10, (codelength - 1)) * 9)) + Math.pow(10, (codelength - 1));
};

SMSVerify.prototype.getExpiration = function() {
    return 900;
};

SMSVerify.prototype.request = function(phone) {
    console.log('Requesting SMS to be sent to ' + phone);

    const otp = this.generateOneTimeCode();
    cache.set(phone, otp, this.getExpiration() * 1000);

    const smsMessage = '[#] Use ' + otp + ' as your code for the app!\n' + this.appHash;
    console.log(smsMessage);

    this.twilioClient.messages.create({
        to: phone,
        from: this.sendingPhoneNumber,
        body: smsMessage,
    }).then((message) => console.log(message.sid));
};

SMSVerify.prototype.verify = function(phone, smsMessage) {
    console.log('Verifying ' + phone + ':' + smsMessage);
    const otp = cache.get(phone);
    if (otp == null) {
        console.log('No cached otp value found for phone: ' + phone);
        return false;
    }
    if (smsMessage.indexOf(otp) > -1) {
        console.log('Found otp value in cache');
        return true;
    } else {
        console.log('Mismatch between otp value found and otp value expected');
        return false;
    }
};

SMSVerify.prototype.reset = function(phone) {
    console.log('Resetting code for:  ' + phone);
    const otp = cache.get(phone);
    if (otp == null) {
        console.log('No cached otp value found for phone: ' + phone);
        return false;
    }
    cache.remove(phone);
    return true;
};
