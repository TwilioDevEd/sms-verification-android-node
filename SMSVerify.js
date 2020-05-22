
function SMSVerify(twilioClient, appHash, verificationServiceSID, countryCode) {
  this.twilioClient = twilioClient;
  this.appHash = appHash;
  this.verificationServiceSID = verificationServiceSID;
  this.countryCode = countryCode;
};

module.exports = SMSVerify;

SMSVerify.prototype.getE164Number = function(phone, callback) {
  this.twilioClient.lookups.phoneNumbers(phone)
      .fetch({countryCode: this.countryCode})
      .then((lookupResult) => {
        console.log(lookupResult.phoneNumber);
        callback(lookupResult.phoneNumber);
      })
      .catch((error) => {
        console.error(error);
        callback(null);
      });
};

SMSVerify.prototype.request = function(phone) {
  console.log('Requesting verification SMS to be sent to ' + phone);
  this.getE164Number(phone, (formattedPhoneNumber) => {
    this.twilioClient.verify.services(this.verificationServiceSID)
        .verifications
        .create({
          to: formattedPhoneNumber,
          channel: 'sms',
          appHash: this.appHash,
        })
        .then((verification)=> console.log(verification.sid))
        .catch((error) => console.error(error));
  });
};

SMSVerify.prototype.verify = function(phone, smsMessage, callback) {
  console.log('Verifying ' + phone + ':' + smsMessage);

  // This regexp finds the last numeric code in the message, of any length
  const code = smsMessage.match(/[0-9]+(?!.*[0-9])/);
  console.log('Verifying code: (' + code + ')');
  this.getE164Number(phone, (formattedPhoneNumber) => {
    this.twilioClient.verify.services(this.verificationServiceSID)
        .verificationChecks
        .create({to: formattedPhoneNumber, code: code})
        .then((verificationCheck) => {
          console.log(verificationCheck);
          callback(verificationCheck.status == 'approved');
        })
        .catch((error) => {
          console.error(error);
          callback(false);
        });
  });
};

SMSVerify.prototype.reset = function(phone) {
  console.log('Resetting code for:  ' + phone);
  // Not needed for Verify
  return true;
};
