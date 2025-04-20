import { client } from './../config/database.js';
import CustomError from './../utils/custom.error.js';
import bcrypt from 'bcrypt';

export default class StudentsService {
    async getAllStudents() {
        const { rows: students } = await client.query("SELECT id, first_name, last_name, username, phone, enrollment_date FROM students;");
        return {
            success: true,
            count: students.length,
            students: students
        };
    }
    async getStudentById(id) {
        const { rows: students } = await client.query("SELECT id, first_name, last_name, username, phone, address, birth_date, status, enrollment_date FROM students WHERE id = $1;", [id]);
        if (!students.length) throw new CustomError(404, "Student not found!");
        return students[0];
    }
    async createStudent(data) {
        if (!data) throw new CustomError(400, "Insufficient data to create student!");
        let { firstName, lastName, username, password, phone, address, birthDate } = data;
        if (!firstName || !lastName || !username || !password || !phone || !address || !birthDate) throw new CustomError(400, "Insufficient data to create student!");
        const { rows: students } = await client.query("SELECT id FROM students WHERE username = $1", [username]);
        if (students.length) throw new CustomError(409, "Username already exists!");
        password = await bcrypt.hash(password, +process.env.BCRYPT_HASH);
        const { rows: student } = await client.query("INSERT INTO students (first_name, last_name, username, password, phone, address, birth_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name, last_name, username, phone, address, birth_date, enrollment_date;", [firstName, lastName, username, password, phone, address, birthDate]);
        return {
            success: true,
            student: student
        };
    }
}