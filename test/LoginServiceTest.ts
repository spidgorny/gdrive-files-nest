import {TestFramework} from "./TestFramework";
import {LoginService} from "../src/modules/login/LoginService";

export class LoginServiceTest extends TestFramework {

	ls: LoginService;

	constructor() {
		super();
		console.log('c', this);
	}

	async run() {
		this.ls = new LoginService();
		try {
			await this.ls.makeOAuth();
			this.test_instance();
			const loginOK = await this.test_login();
			if (!loginOK) {
				console.log(await this.ls.getLoginURI());
				return;
			}

			// const me = await this.test_getMe();
			// console.log(me);

			// const files = await this.test_listFiles();
			// console.log('files', files);

			const files = await this.test_allFiles();
			console.log('all files', files.length);
		} catch(e) {
			console.error('catch', e);
		}
	}

	test_instance() {
		this.assertInstanceOf(LoginService, this.ls, 'test_instance');
	}

	async test_login() {
		this.assertEquals(true, this.ls.isAuth(), 'test_login');
		return this.ls.isAuth();
	}

	async test_getMe() {
		console.log('test_getMe');
		const me = await this.ls.getMe();
		console.log('test_getMe', me);
		return me;
	}

	async test_listFiles() {
		console.log('test_listFiles');
		const files = await	this.ls.listFiles();
		console.log('test_listFiles', files);
		return files;
	}

    /**
     * @returns {Promise<DriveFile[]>}
     */
	async test_allFiles() {
        console.log('test_listAllFiles');
        const files = await	this.ls.listAllFiles();
        console.log('test_listAllFiles', files);
        return files;
	}

}
