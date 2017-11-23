import {DriveFile} from '../files/DriveFile';

export class DriveResponse {

    kind: "drive#fileList";
    etag: string;
    selfLink: string;
    nextLink: string;
    incompleteSearch: boolean;
    files: DriveFile[];
    nextPageToken?: string;

}
