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
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
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