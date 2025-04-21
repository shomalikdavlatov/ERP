import { client } from './../config/database.js';
import CustomError from './../utils/custom.error.js';
import GroupService from './../services/groups.service.js';

export default class LessonsService {
    constructor() {
        this.gService = new GroupService();
    }
    async getAllLessons() {
        const { rows: lessons } = await client.query("SELECT l.id, g.id AS group_id, g.name, l.title, l.description, l.lesson_date, l.start_time, l.end_time, l.room_number FROM lessons l LEFT JOIN groups g ON l.group_id = g.id;");
        return lessons;
    }
    async getLessonById(id) {
        const { rows: lessons } = await client.query("SELECT l.id, g.id AS group_id, g.name, l.title, l.description, l.lesson_date, l.start_time, l.end_time, l.room_number FROM lessons l INNER JOIN groups g ON l.group_id = g.id WHERE l.id = $1;", [id]);
        if (!lessons.length) throw new CustomError(404, "Lesson not found!");
        return lessons[0];
    }
    async getAttendancesByLessonId(id) {

    }
    async createLesson(id, data) {
        if (!data) throw new CustomError(400, "Insufficient data to create lesson!");
        const { groupId, title, description, lessonDate, startTime, endTime, roomNumber } = data;
        if (!groupId || !title || !description || !lessonDate || !startTime || !endTime || !roomNumber) throw new CustomError(400, "Insufficient data to create lesson!");
        const group = await this.gService.getGroupById(groupId);
        const { rows: lessons } = await client.query("INSERT INTO lessons (group_id, title, description, lesson_date, start_time, end_time, room_number, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id, title, description, lesson_date, start_time, end_time, room_number;", [groupId, title, description, lessonDate, startTime, endTime, roomNumber, id]);
        return {
            ...lessons[0],
            group: {
                id: group.id,
                name: group.name
            }

        }
    }
}