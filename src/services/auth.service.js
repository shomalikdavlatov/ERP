import { generateToken } from './../utils/jwt.js';
import { client } from './../config/database.js';
import CustomError from './../utils/custom.error.js';
import bcrypt from 'bcrypt';

export default class AuthService {
    async login({ username, password }) {
        let user = await client.query("SELECT * FROM staffs WHERE username = $1;", [username]);
        user = user.rows[0];
        if (!user) throw new CustomError(401, "Unauthorized");
        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new CustomError(401, "Unauthorized");
        return {
            success: true,
            token: generateToken({
                id: user.id,
                username: user.username,
                role: user.role
            }),
            staff: (({ id, first_name: firstName, last_name: lastName, username, role, position }) => ({
                id, firstName, lastName, username, role, position
            }))(user)   
        }
    }
}