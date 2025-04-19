import AuthService from './../services/auth.service.js';

export default class AuthController {
    constructor() {
        this.service = new AuthService();
    }
    login(req, res) {
        try {
            const { username, role } = req.body;
        if (!username || !role) return res.status(400).json({ message: "Username and role required!" });
        const token = this.service.generateToken({ username, role });
        return res.json({token});
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