import StaffsService from './../services/staffs.service.js';

export default class StaffsController {
    constructor() {
        this.service = new StaffsService();
    }
    async getAllStaffsController(req, res) {
        try {
            const staffs = await this.service.getAllStaffs();
            res.json(staffs);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({message: error.message});
        }
    }
    async createTeacherController(req, res) {
        try {
            const staff = await this.service.createTeacher(req.body);
            res.status(201).json(staff);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({message: error.message});
        }
    }
    async createAdminController(req, res) {
        try {
            const staff = await this.service.createAdmin(req.body);
            res.status(201).json(staff);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({message: error.message});
        }
    }
    async createSuperAdminController(req, res) {
        try {
            const staff = await this.service.createSuperAdmin(req.body);
            res.status(201).json(staff);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({message: error.message});
        }
    }
}