import { client } from './../config/database.js';
import CustomError from './../utils/custom.error.js'
import bcrypt from 'bcrypt';

export default class StaffsService {
    async getAllStaffs() {
        const { rows: staffs } = await client.query("SELECT id, first_name, last_name, username, role, position, phone, hire_date FROM staffs;");
        return {
            success: true,
            count: staffs.length,
            staffs: staffs
        };
    }
    async createStaff(data, role) {
        if (!data) throw new CustomError(400, "Insufficient data to create staff!");
        let { firstName, lastName, username, password, position, phone, address } = data;
        if (!firstName || !lastName || !username || !password || !position || !phone || !address) throw new CustomError(400, "Insufficient data to create staff!");
        const { rows: staffs } = await client.query("SELECT id FROM staffs WHERE username = $1;", [username]);
        if (staffs.length) throw new CustomError(409, "Username already exists!");
        password = await bcrypt.hash(password, +process.env.BCRYPT_HASH);
        const { rows: staff } = await client.query("INSERT INTO staffs (first_name, last_name, username, password, role, position, phone, address) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, first_name, last_name, username, role, position, phone, address, hire_date;", [firstName, lastName, username, password, role, position, phone, address]);
        return {
            success: true,
            staff: staff
        };
    }
    async createTeacher(data) {
        return await this.createStaff(data, 'teacher');
    }
    async createAdmin(data) {
        return await this.createStaff(data, 'admin');
    }
    async createSuperAdmin(data) {
        return await this.createStaff(data, 'superadmin');
    }
}