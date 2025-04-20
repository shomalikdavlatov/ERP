import TeachersService from './../services/teachers.service.js';

export default class TeachersController {
    constructor() {
        this.service = new TeachersService();
    }
    
}