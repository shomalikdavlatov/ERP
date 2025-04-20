import LessonsService from './../services/lessons.service.js';

export default class LessonsController {
    constructor() {
        this.service = new LessonsService();
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