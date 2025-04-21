import LessonsService from './../services/lessons.service.js';

export default class LessonsController {
    constructor() {
        this.service = new LessonsService();
    }
    async getAllLessonsController(req, res) {
        try {
            const lessons = await this.service.getAllLessons();
            res.json(lessons);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
    async getLessonByIdController(req, res) {
        try {
            const lesson = await this.service.getLessonById(req.params.id);
            res.json(lesson);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
    async createLessonController(req, res) {
        try {
            console.log(req.user);
            const lesson = await this.service.createLesson(req.user.id, req.body);
            res.status(201).json(lesson);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
}