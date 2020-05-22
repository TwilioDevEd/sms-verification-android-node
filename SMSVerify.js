
function SMSVerify(twilioClient, sendingPhoneNumber, appHash, verificationServiceSID) {
    this.twilioClient = twilioClient;
    this.sendingPhoneNumber = sendingPhoneNumber;
    this.appHash = appHash;
    this.verificationServiceSID = verificationServiceSID;
};

module.exports = SMSVerify;

SMSVerify.prototype.request = function(phone) {
    console.log('Requesting verification SMS to be sent to ' + phone);

    this.twilioClient.verify.services(this.verificationServiceSID)
    .verifications
    .create({
        to: phone, 
        channel: 'sms', 
        appHash: this.appHash
    })
    .then(verification => console.log(verification.sid))
    .catch(error => console.error(error));
};

SMSVerify.prototype.verify = function(phone, smsMessage, callback) {

    console.log('Verifying ' + phone + ':' + smsMessage);

    // This regexp finds the last numeric code in the message, of any length
    let code = smsMessage.match(/[0-9]+(?!.*[0-9])/);
    console.log('Verifying code: (' + code + ')');

    this.twilioClient.verify.services(this.verificationServiceSID)
    .verificationChecks
    .create({to: phone, code: code })
    .then(verification_check => {
        console.log(verification_check);
        callback(verification_check.status == "approved");
    })
    .catch(error => {
        console.error(error)
        callback(false);
    });
};

SMSVerify.prototype.reset = function(phone) {
    console.log('Resetting code for:  ' + phone);
    // Not needed for Verify
    return true;
};
