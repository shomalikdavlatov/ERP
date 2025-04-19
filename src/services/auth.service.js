import jwt from 'jsonwebtoken';

export default class AuthService {
    generateToken(user) {
        return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "12h" });
    }
}