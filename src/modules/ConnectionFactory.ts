import {LoginService} from './login/LoginService';

let singleLoginService: LoginService;

export const ConnectionFactory = {
    provide: 'LoginService',
    useFactory: async () => {
        if (!singleLoginService) {
            singleLoginService = new LoginService();
            try {
                await singleLoginService.makeOAuth()
                console.log('singleLoginService init ok');
            } catch(err) {
                console.error(err);
            }
        }
        return singleLoginService;
    },
};

