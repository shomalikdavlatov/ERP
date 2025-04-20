import CoursesService from './../services/courses.service.js';

export default class CoursesController {
    constructor() {
        this.service = new CoursesService();
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