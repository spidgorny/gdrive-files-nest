const fs = require('fs');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const plus = google.plus('v1');


export class LoginService {

	TOKEN_DIR = __dirname + '/../../../.credentials/';
	TOKEN_PATH = this.TOKEN_DIR + 'google_token.json';
	CLIENT_ID_PATH = this.TOKEN_DIR + 'client_id.json';
	scopes = [
		'https://www.googleapis.com/auth/plus.me',
		'https://www.googleapis.com/auth/calendar',
		'https://www.googleapis.com/auth/drive.metadata.readonly'
	];
	oauth2Client;

	constructor() {
		fs.readFile(this.CLIENT_ID_PATH, async (err, content) => {
			if (err) {
				console.log('Error loading client secret file: ' + err);
				return;
			}
			// Authorize a client with the loaded credentials, then call the
			// Drive API.
			const config = JSON.parse(content).web;
			this.oauth2Client = new OAuth2(
				config.client_id,
				config.client_secret,
				config.redirect_uri,
			);

			await this.readToken();
		});
	}

	/**
	 * Called by the constructor
	 * @returns {Promise<any>}
	 */
	readToken() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.TOKEN_PATH, (err, token) => {
				if (err) {
					reject();
				}
				this.oauth2Client.credentials = JSON.parse(token);
				resolve();
			});
		});
	}

	isAuth() {
		//console.log(this.oauth2Client.credentials);
		return Object.keys(this.oauth2Client.credentials).length;
	}

	async getLoginURI() {
		// generate a url that asks permissions for Google+ and Google Calendar scopes
		return this.oauth2Client.generateAuthUrl({
			// 'online' (default) or 'offline' (gets refresh_token)
			access_type: 'offline',

			// If you only need one scope you can pass it as a string
			scope: this.scopes,

			// Optional property that passes state parameters to redirect URI
			// state: 'foo'
		});
	}

	catchLogin(code: string) {
		return new Promise((resolve, reject) => {
			this.oauth2Client.getToken(code, (err, tokens) => {
				// Now tokens contains an access_token and an optional refresh_token. Save them.
				if (err) {
					console.error(err);
					reject(err);
				}
				console.log(tokens);
				this.storeToken(tokens);
				this.oauth2Client.setCredentials(tokens);
				google.options({
					auth: this.oauth2Client
				});
				resolve(tokens);
			});
		});
	}

	/**
	 * Store token to disk be used in later program executions.
	 *
	 * @param {Object} token The token to store to disk.
	 */
	storeToken(token) {
		try {
			fs.mkdirSync(this.TOKEN_DIR);
		} catch (err) {
			if (err.code != 'EEXIST') {
				throw err;
			}
		}
		fs.writeFile(this.TOKEN_PATH, JSON.stringify(token));
		console.log('Token stored to ' + this.TOKEN_PATH);
	}

	getMe() {
		plus.people.get({
			userId: 'me',
		}, function (err, response) {
			// handle err and response
			if (err) {
				console.error(err);
				return;
			}
			console.log(response)
		})
	}

	/**
	 * Lists the names and IDs of up to 10 files.
	 *
	 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
	 */
	listFiles() {
		const service = google.drive('v3');
		service.files.list({
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
					let file = files[i];
					console.log('%s (%s)', file.name, file.id);
				}
			}
		});
	}

}
