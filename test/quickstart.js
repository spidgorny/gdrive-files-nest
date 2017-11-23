const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/drive-nodejs-quickstart.json
const SCOPES = [
	'https://www.googleapis.com/auth/drive.metadata.readonly'
];
// var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
	// process.env.USERPROFILE) + '/.credentials/';
const TOKEN_DIR = __dirname + '/../.credentials/';
const TOKEN_PATH = TOKEN_DIR + 'google_token.json';
const CLIENT_ID_PATH = TOKEN_DIR + 'client_id.json';

// Load client secrets from a local file.
fs.readFile(CLIENT_ID_PATH, function processClientSecrets(err, content) {
	if (err) {
		console.log('Error loading client secret file: ' + err);
		return;
	}
	// Authorize a client with the loaded credentials, then call the
	// Drive API.
	authorize(JSON.parse(content).web, listFiles);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const clientSecret = credentials.client_secret;
    const clientId = credentials.client_id;
    const redirectUrl = credentials.redirect_uri;
    const auth = new googleAuth();
    const oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    // Check if we have previously stored a token.
	fs.readFile(TOKEN_PATH, function(err, token) {
		if (err) {
			getNewToken(oauth2Client, callback);
		} else {
			oauth2Client.credentials = JSON.parse(token);
			callback(oauth2Client);
		}
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    const authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
		rl.close();
		oauth2Client.getToken(code, function(err, token) {
			if (err) {
				console.log('Error while trying to retrieve access token', err);
				return;
			}
			oauth2Client.credentials = token;
			storeToken(token);
			callback(oauth2Client);
		});
	});
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
	try {
		fs.mkdirSync(TOKEN_DIR);
	} catch (err) {
		if (err.code != 'EEXIST') {
			throw err;
		}
	}
	fs.writeFile(TOKEN_PATH, JSON.stringify(token));
	console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listFiles(auth) {
    const service = google.drive('v3');
    service.files.list({
		auth: auth,
		pageSize: 10,
		fields: "nextPageToken, files(id, name)"
	}, function(err, response) {
		if (err) {
			console.log('The API returned an error: ' + err);
			return;
		}
        const files = response.files;
        if (files.length == 0) {
			console.log('No files found.');
		} else {
			console.log('Files:');
			for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log('%s (%s)', file.name, file.id);
			}
		}
	});
}
