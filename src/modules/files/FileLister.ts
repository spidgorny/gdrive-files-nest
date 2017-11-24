import {DriveResponse} from './DriveResponse';
import {Profiler} from './Profiler';
import {LoginService} from '../login/LoginService';
const google = require('googleapis');

export class FileLister {

    profiler = new Profiler();

    constructor(protected readonly loginService: LoginService) {
    }

    /**
     * Lists the names and IDs of up to 10 files.
     * @return Promise
     */
    listFiles() {
        return new Promise((resolve, reject) => {
            //console.log(this.token);
            this.profiler.profile('service.files.list');
            this.listFilesPage(null, (err, response) => {
                this.profiler.profileEnd();
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return reject(err);
                }
                const files = response.files;
                resolve(files);
            });
        });
    }

    listFilesPage(pageToken, callback) {
        const service = google.drive('v3');
        service.files.list({
            auth: this.loginService.oauth2Client,
            pageSize: 100,
            fields: "nextPageToken, files(id, name, parents, mimeType, modifiedTime, trashed, webViewLink)",
            pageToken: pageToken,
        }, callback);
    }

    /**
     * @returns {Promise<[]>}
     */
    listAllFiles(): Promise<Array<any>> {
        return new Promise(async (resolve, reject) => {
            let acc = [];
            let nextPageToken = null;
            do {
                let response: DriveResponse = await this.listFilesPageGetResponse(nextPageToken);
                console.log(Object.keys(response), response.files.length);
                acc = acc.concat(response.files);
                nextPageToken = 'nextPageToken' in response ? response.nextPageToken : null;
            } while (nextPageToken);
            resolve(acc);
        });
    }

    /**
     * @param nextPageToken
     * @returns {Promise<DriveResponse>}
     */
    listFilesPageGetResponse(nextPageToken?: string): Promise<DriveResponse> {
        return new Promise((resolve, reject) => {
            this.listFilesPage(nextPageToken, (err, response: DriveResponse) => {
                if (err) {
                    console.log('The API returned an error: ' + err);
                    return reject(err);
                }
                resolve(response);
            });
        });
    }

}
