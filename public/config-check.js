$(function() {
    $.get('/config', function(response) {
        configureField(response, 'TWILIO_ACCOUNT_SID', 'twilioAccountSID', false);
        configureField(response, 'TWILIO_API_KEY', 'twilioAPIKey', false);
        configureField(response, 'TWILIO_API_SECRET', 'twilioAPISecret', true);
        configureField(response, 'SENDING_PHONE_NUMBER', 'sendingPhoneNumber', false);
        configureField(response, 'APP_HASH', 'appHash', false);
        configureField(response, 'CLIENT_SECRET', 'clientSecret', false);
    });
    const configureField = function(response, keyName, elementId, masked) {
        if (masked) {
            if (response[keyName]) {
                $('#' + elementId).html('Configured properly');
                $('#' + elementId).addClass('set');
            } else {
                $('#' + elementId).html('Not configured in .env');
                $('#' + elementId).addClass('unset');
            }
        } else {
            if (response[keyName] && response[keyName] != '') {
                $('#' + elementId).html(response[keyName]);
                $('#' + elementId).addClass('set');
            } else {
                $('#' + elementId).html('Not configured in .env');
                $('#' + elementId).addClass('unset');
            }
        }
    };
});
