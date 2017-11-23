var fs = require('fs');
var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plus = google.plus('v1');
var TOKEN_DIR = __dirname + '/.credentials/';
var CLIENT_ID_PATH = TOKEN_DIR + 'client_id.json';
fs.readFile(CLIENT_ID_PATH, function processClientSecrets(err, content) {
    if (err) {
        console.log('Error loading client secret file: ' + err);
        return;
    }
    var config = JSON.parse(content).web;
    var oauth2Client = new OAuth2(config.client_id, config.client_secret, config.redirect_uri);
    if (config.token) {
    }
    else if (config.code) {
        catchLogin(oauth2Client, config.code, getMe);
    }
    else {
        authorize(oauth2Client, listFiles);
    }
});
function authorize(oauth2Client, next) {
    var scopes = [
        'https://www.googleapis.com/auth/plus.me',
        'https://www.googleapis.com/auth/calendar'
    ];
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes,
    });
    next(url);
}
function listFiles(url) {
    console.log(url);
}
function catchLogin(oauth2Client, code, next) {
    oauth2Client.getToken(code, function (err, tokens) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(tokens);
        oauth2Client.setCredentials(tokens);
        google.options({
            auth: oauth2Client
        });
        next();
    });
}
function getMe() {
    plus.people.get({
        userId: 'me',
    }, function (err, response) {
        if (err) {
            console.error(err);
            return;
        }
        console.log(response);
    });
}
