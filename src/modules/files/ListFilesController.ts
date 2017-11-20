import {Controller, Get, Res} from '@nestjs/common'
import {BaseController} from '../BaseController'
import {LoginService} from "../login/LoginService";
import {Response} from "express";
import {DriveFile} from "./DriveFile";

@Controller()
export class ListFilesController extends BaseController {

	loginService: LoginService;

	constructor() {
		super();
		this.loginService = new LoginService();
	}

	@Get('listFiles')
	async render(@Res() response: Response) {
		let content;
		try {
			// this.loginOrRedirect(response);
			this.loginOrException();
			content = `<h1>Files</h1>`;
			//const files: DriveFile[] = await this.loginService.listFiles();
			const files = this.listFiles();
			console.log(files);
			content = this.renderFolders(files);
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
		return files.map(f => {
			return new DriveFile(f);
		});
	}

	renderFolders(files: Array<DriveFile>) {
		let content = [];
		for (let f of files) {
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
						<li><a href="#">Report File name either Slide or PDF</a></li>
						<li><a href="#">Report File name either Slide or PDF</a></li>
						<li><a href="#">Report File name either Slide or PDF</a></li>
						<li><a href="#">Report File name either Slide or PDF</a></li>
						<li><a href="#">Report File name either Slide or PDF</a></li>
						<li><a href="#">Report File name either Slide or PDF</a></li>
						<li><a href="#">Report File name either Slide or PDF</a></li>
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
