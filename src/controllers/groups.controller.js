import GroupsService from './../services/groups.service.js';

export default class GroupsController {
    constructor() {
        this.service = new GroupsService();
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