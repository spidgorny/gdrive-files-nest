import {Controller, Get, Res} from '@nestjs/common'
import {BaseController} from '../BaseController'
import {LoginService} from "../login/LoginService";
import {Response} from "express";
import {DriveFile} from "./DriveFile";
import {FileLister} from './FileLister';
import {CachedFileList} from './CachedFileList';
import {DriveFileCollection} from './DriveFileCollection';

@Controller()
export class ListFilesController extends BaseController {

	constructor(protected readonly loginService: LoginService) {
		super(loginService);
		console.log('ListFilesController.constructor');
	}

	@Get('listFiles')
	async render(@Res() response: Response) {
		let content;
		try {
			// this.loginOrRedirect(response);
			this.loginOrException();
			content = `<h1>Files</h1>`;
            // const files = this.listFiles();
            const fl = new FileLister(this.loginService);
            // const rawFiles = fl.listAllFiles();
            // const files: DriveFile[] = this.convertToDriveFiles(rawFiles);
            const cfl = new CachedFileList(fl);
            const files = await cfl.listAllFiles();
            const col = new DriveFileCollection(files);
			// console.log(files);
			content = this.renderFolders(col);
		} catch (error) {
			console.error(error);
			content = this.error(error);
		}
		console.log(content.length);
		content = await this.renderTemplate(content);
		console.log(content.length, typeof content);
		response.type('html').send(content);
	}

	listFiles(): DriveFile[] {
		const files = [{
			id: '1LBSCpTu3WiPbWu3VS04TqZ6MJQYRxFSs',
			name: 'stefan',
			parents: ['1q6yYWYd9cqPRgnZhwFq8ddatSsiIHnmj']
		},
			{
				id: '1U6-PfjNj6vgAkUiggVlmRTQz3aBpCZeD',
				name: 'lesik',
				parents: ['1q6yYWYd9cqPRgnZhwFq8ddatSsiIHnmj']
			},
			{
				id: '1q6yYWYd9cqPRgnZhwFq8ddatSsiIHnmj',
				name: 'marina',
				parents: ['1jQctyqk-ovQDqsslQb92KY9ulegZNXVd']
			},
			{
				id: '1jQctyqk-ovQDqsslQb92KY9ulegZNXVd',
				name: 'slawa',
				parents: ['0AGQbDJ5eANsvUk9PVA']
			}];
		return this.convertToDriveFiles(files);
	}

	convertToDriveFiles(files: any) {
        return files.map(f => {
            return new DriveFile(f);
        });
	}

	renderFolders(col: DriveFileCollection) {
		let content = [];
		let files = col.getRootFiles();
		let folders = col.getOnlyFolders(files);
		for (let f of folders) {
			content.push(this.folderRow(f))
		}
		return content.join();
	}

	folderRow(file: DriveFile) {
		const template = `
	<div class="row mt-3">
		<div class="col-sm-6">
    		<div class="card">
    			<div class="card-body">
					<div class="card-title">
						<h5>Folder ${file.name}</h5>
					</div>
					<ul>
						<li><a href="#">Report File name either Slide or PDF</a>
						<span class="badge badge-primary">new</span>
						</li>
					</ul>
				</div>
			</div>
		</div>
		<div class="col-sm-6">
    		<div class="card">
    			<div class="card-body">
    				<div class="card-title">
						<h6>Report File name</h6>
					</div>
					<p>Description</p>
				</div>
			</div>
		</div>
	</div>
`;
		return template;
	}

}
