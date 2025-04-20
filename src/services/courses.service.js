import { client } from './../config/database.js';
import CustomError from './../utils/custom.error.js';

export default class CoursesService {
    async getAllCourses() {
        const { rows: courses } = await client.query("SELECT id, name, description, price, duration, level, is_active FROM courses;");
        return courses;
    }
    async getCourseById(id) {
        const { rows: courses } = await client.query("SELECT id, name, description, price, duration, level, is_active FROM courses WHERE id = $1;", [id]);
        if (!courses.length) throw new CustomError(404, "Course not found");
        return courses[0];
    }
    async createCourse(data) {
        if (!data) throw new CustomError(400, "Insufficient data to create course!");
        const { name, description, price, duration, level } = data;
        if (!name || !description || !price || !duration || !level) throw new CustomError(400, "Insufficient data to create course!");
        const { rows: course } = await client.query("INSERT INTO courses (name, description, price, duration, level) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, description, price, duration, level, is_active;", [name, description, price, duration, level]);
        return {
            success: true,
            course: course[0]
        };
    }
}