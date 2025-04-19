import AuthService from './../services/auth.service.js';

export default class AuthController {
    constructor() {
        this.service = new AuthService();
    }
    async login(req, res) {
        try {
            res.status(200).json(await this.service.login(req.body));
        }
        catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }
    register() {

    }
    user(req, res) {
        try {
            res.json({ message: `Welcome user ${req.user.username}` });
        }
        catch (error) {
            res.status(error.status).json({ message: error.message });
        }
    }
    admin(req, res) {
        res.status(200).json({ message: `Welcome admin ${req.user.username}` });
    }
}