import {Controller, Get, Query, Res} from '@nestjs/common'
import {BaseController} from '../BaseController'
import {LoginService} from "../login/LoginService";
import {Response} from "express";
import {DriveFile} from "./DriveFile";
import {FileLister} from './FileLister';
import {CachedFileList} from './CachedFileList';
import {DriveFileCollection} from './DriveFileCollection';
const fs = require('fs');
const handlebars = require('handlebars');

@Controller()
export class ListFilesController extends BaseController {

    rowTemplate: Function;

    desc: any;

    col: DriveFileCollection;

	constructor(protected readonly loginService: LoginService) {
		super(loginService);
		console.log('ListFilesController.constructor');
		const html = fs.readFileSync('./src/modules/files/rowTemplate.html');
		this.rowTemplate = handlebars.compile(html.toString());

		const descJson = fs.readFileSync('data/business/slawa.json');
        this.desc = JSON.parse(descJson);
        console.log('desc', Object.keys(this.desc).length);

        this.loadFiles().then(() => {
            console.log('this.col', this.col.constructor.name);
        });
	}

	async loadFiles() {
        try {
            // this.loginOrRedirect(response);
            this.loginOrException();
            // const files = this.listFiles();
            const fl = new FileLister(this.loginService);
            // const rawFiles = fl.listAllFiles();
            // const files: DriveFile[] = this.convertToDriveFiles(rawFiles);
            const cfl = new CachedFileList(fl);
            const files = await cfl.listAllFiles();
            console.log('loadFiles', files.length);
            this.col = new DriveFileCollection(files);
        } catch (error) {
            console.error(error);
        }
    }

	@Get('listFiles')
	async render(@Res() response: Response) {
		let content;
		try {
		    await this.loadFiles();
			content = this.renderFolders();
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

	renderFolders() {
		let content = [];
		let files = this.col.getRootFiles();
		let folders = this.col.getOnlyFolders(files);
		folders = this.col.addChildren(folders);
		for (let f of folders) {
			content.push(this.folderRowHB(f))
		}
		return content.join(String.fromCharCode(10));
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

    folderRowHB(file: DriveFile) {
	    return this.rowTemplate(file);
    }

    @Get('getFileInfo')
    async getFileInfo(@Query('id') id) {
        await this.loadFiles();
	    let content = [];
        let file = this.col.findById(id);
        let fileName = file ? file.name : null;
        content.push(`<div class="card-title">
                    <h6>${fileName || id}</h6></div>`);

	    let desc;
	    if (id in this.desc) {
            desc = '<p>'+this.desc[id]+'</p>';
        } else {
	        if (this.col) {
                if (file) {
                    desc = this.desc[file.name]
                        || '<i>no desc for ' + file.name + '</i>';
                } else {
                    desc = '<i>no desc found</i>';
                }
            } else {
	            desc = '<i>file collection not loaded</i>';
            }
        }
        content.push(desc);

	    content.push(`<br />
<a href="${file.webViewLink}" target="_blank">
    <button type="button" class="btn btn-primary btn-circle btn-lg float-right">
        <img class="icon" src="http://www.entypo.com/images/publish.svg" alt="Open" style="
    width: 20px;
    max-width: 100%;
    vertical-align: middle;
    display: inline-block;
"/>
    </button>
</a>`);
	    return content.join('');
    }

}
