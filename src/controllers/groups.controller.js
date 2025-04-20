import GroupsService from './../services/groups.service.js';

export default class GroupsController {
    constructor() {
        this.service = new GroupsService();
    }
    async getAllGroupsController(req, res) {
        try {
            const groups = await this.service.getAllGroups();
            res.json(groups);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
    async getGroupByIdController(req, res) {
        try {
            const group = await this.service.getGroupById(req.params.id);
            res.json(group)
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
    async getLessonsByGroupIdController(req, res) {
        try {
            const lessons = await this.service.getLessonsByGroupId(req.params.id, req.query);
            res.json(lessons);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
    async createGroupController(req, res) {
        try {
            const group = await this.service.createGroup(req.body);
            res.status(201).json(group);
        }
        catch (error) {
            if (!error.status) return res.status(500).json({ message: error.message });
            res.status(error.status).json({ message: error.message });
        }
    }
}