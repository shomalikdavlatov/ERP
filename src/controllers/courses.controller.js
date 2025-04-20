import CoursesService from './../services/courses.service.js';

export default class CoursesController {
    constructor() {
        this.service = new CoursesService();
    }
    async getAllCoursesController(req, res) {
        try {
            const courses = await this.service.getAllCourses();
            res.json(courses);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
    async getCourseByIdController(req, res) {
        try {
            const course = await this.service.getCourseById(req.params.id);
            res.json(course);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
    async createCourseController(req, res) {
        try {
            const result = await this.service.createCourse(req.body);
            res.status(201).json(result);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
}