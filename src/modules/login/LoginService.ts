import {DriveFile} from "../files/DriveFile";
import {Component} from '@nestjs/common';

const fs = require('fs');
const google = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const plus = google.plus('v1');

@Component()
export class LoginService {

	TOKEN_DIR = __dirname + '/../../../.credentials/';
	TOKEN_PATH = this.TOKEN_DIR + 'google_token.json';
	CLIENT_ID_PATH = this.TOKEN_DIR + 'client_id.json';
	scopes = [
		'https://www.googleapis.com/auth/plus.me',
		'https://www.googleapis.com/auth/calendar',
		'https://www.googleapis.com/auth/drive.metadata.readonly'
	];

	/**
	 * @var OAuth2
	 */
	oauth2Client;
	token;

	/**
	 * For profiling
	 */
	startTime: number;
    private profileName: string;

	constructor() {
		console.log('ListService.constructor');
	}

	async makeOAuth() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.CLIENT_ID_PATH, async (err, content) => {
				if (err) {
					console.log('Error loading client secret file: ' + err);
					return reject(err);
				}
				// Authorize a client with the loaded credentials, then call the
				// Drive API.
				const config = JSON.parse(content).web;
				this.oauth2Client = new OAuth2(
					config.client_id,
					config.client_secret,
					config.redirect_uri,
				);
				console.log('this.oauth2Client');

				try {
					await this.readToken();
                } catch (e) {
					//console.error(e);
					//{ Error: ENOENT: no such file or directory, open '.credentials\google_token.json'
                }
				resolve();
			});
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
					return reject(err);
				}
				// console.log('token', token);
				this.token = JSON.parse(token);
				this.oauth2Client.setCredentials(this.token);
				google.options({
					auth: this.oauth2Client
				});
				resolve();
			});
		});
	}

	isAuth() {
		//console.log(this.oauth2Client.credentials);
		if (!Object.keys(this.oauth2Client.credentials).length) {
			return false;
		}
        const expiry_date = this.oauth2Client.credentials.expiry_date;
		console.log(expiry_date, new Date().getTime());
		if (expiry_date > new Date().getTime()) {
			return false;
		}
		return true;
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
			console.log(this.oauth2Client);
			this.oauth2Client.getToken(code, (err, tokens) => {
				// Now tokens contains an access_token and an optional refresh_token. Save them.
				if (err) {
					console.error('catchLogin', err);
					return reject(err);
				}
				console.log('catchLogin', tokens);
				this.token = tokens;
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

	logout() {
		fs.unlinkSync(this.TOKEN_PATH);
		this.token = null;
        this.oauth2Client.setCredentials(null);
        google.options({
            auth: null
        });
	}

	getMe() {
		return new Promise((resolve, reject) => {
            console.log('plus.people.get');
            plus.people.get({
                auth: this.oauth2Client,
                userId: 'me',
            }, function (err, response) {
                // handle err and response
                if (err) {
                    console.error('getMe', err);
                    return reject(err);
                }
                console.log('getMe', response);
                resolve(response);
            });
        });
	}

	/**
	 * Lists the names and IDs of up to 10 files.
	 * @return Promise
	 */
	listFiles() {
		return new Promise((resolve, reject) => {
			//console.log(this.token);
			this.profile('service.files.list');
			const service = google.drive('v3');
			service.files.list({
				auth: this.oauth2Client,
				pageSize: 10,
				fields: "nextPageToken, files(id, name)"
			}, (err, response) => {
				this.profileEnd();
				if (err) {
					console.log('The API returned an error: ' + err);
					return reject(err);
				}
				if (!response) {
					console.log('response is null?', response);
					return reject(response);
				}
				const files: [DriveFile] = response.files;
				if (files.length == 0) {
					console.log('No files found.');
				} else {
					console.log('Files:');
					for (let i = 0; i < files.length; i++) {
						let file = files[i];
						console.log('%s (%s)', file.name, file.id);
					}
				}
				resolve(files);
			});
		});
	}

	profile(name: string) {
		this.profileName = name;
		// console.log(name);
		this.startTime = new Date().getTime();
	}

	profileEnd() {
		const diff = new Date().getTime() - this.startTime;
		console.log(this.profileName, '+', diff, 'ms');
	}

}
