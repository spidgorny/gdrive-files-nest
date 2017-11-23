import {LoginService} from './login/LoginService';

let singleLoginService: LoginService;

export const ConnectionFactory = {
    provide: 'LoginService',
    useFactory: () => {
        if (!singleLoginService) {
            singleLoginService = new LoginService();
            singleLoginService.makeOAuth()
                .then(() => {
                    console.log('singleLoginService init ok');
                }).catch(err => {
                console.error(err);
            });
        }
        return singleLoginService;
    },
};

