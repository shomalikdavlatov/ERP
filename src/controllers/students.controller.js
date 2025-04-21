import StudentsService from '../services/students.service.js';

export default class StudentsController {
    constructor() {
        this.service = new StudentsService();
    }
    async getAllStudentsController(req, res) {
        try {
            const students = await this.service.getAllStudents();
            res.json(students);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({message: error.message});
        }
    }
    async getStudentByIdController(req, res) {
        try {
            const student = await this.service.getStudentById(req.params.id);
            res.json(student);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({message: error.message});
        }
    }
    async getAttendancesByStudentIdController(req, res) {
        try {
            const result = await this.service.getAttendancesByStudentId(req.params.studentId, req.query);
            res.json(result);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({message: error.message});
        }
    }
    async createStudentController(req, res) {
        try {
            const student = await this.service.createStudent(req.body);
            res.status(201).json(student);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({message: error.message});
        }
    }
}