import { client } from './../config/database.js';
import CustomError from './../utils/custom.error.js';
import CoursesService from './courses.service.js';
import StaffsService from './staffs.service.js';

export default class GroupsService {
    constructor() {
        this.cService = new CoursesService();
        this.sService = new StaffsService();
    }
    async getAllGroups() {
        const { rows: groups } = await client.query("SELECT g.id, g.name, c.id AS course_id, c.name AS course_name, s.id AS teacher_id, s.first_name, s.last_name, g.start_date, g.schedule, g.max_students, g.status FROM groups g LEFT JOIN courses c ON g.course_id = c.id LEFT JOIN staffs s ON g.teacher_id = s.id;");
        return groups;
    }
    async getGroupById(id) {
        const { rows: groups } = await client.query("SELECT g.id, g.name, c.id AS course_id, c.name AS course_name, s.id AS teacher_id, s.first_name, s.last_name, g.start_date, g.schedule, g.max_students, g.status FROM groups g LEFT JOIN courses c ON g.course_id = c.id LEFT JOIN staffs s ON g.teacher_id = s.id WHERE g.id = $1;", [id]);
        if (!groups.length) throw new CustomError(404, "Group not found!");
        return groups[0];
    }
    async getLessonsByGroupId(groupId, query) {
        if (!Object.keys(await this.getGroupById(groupId)).length) new CustomError(404, "Group not found!");
        const { startDate, endDate } = query;
        query = "SELECT id, title, description, lesson_date, start_time, end_time, room_number FROM lessons WHERE group_id = $1"
        let lessons;
        if (startDate && endDate) {
            query += " AND lesson_date >= $2 AND lesson_date <= $3;";
            lessons = await client.query(query, [groupId, startDate, endDate]);
        }
        else if (startDate) {
            query += " AND lesson_date >= $2;";
            lessons = await client.query(query, [groupId, startDate]);
        }  
        else if (endDate) {
            query += " AND lesson_date <= $2;";
            lessons = await client.query(query, [groupId, endDate]);
        }
        else {
            query += ';';
            lessons = await client.query(query, [groupId]);
        }
        lessons = lessons.rows;
        return {
            success: true,
            lessons
        };
    }
    async createGroup(data) {
        if (!data) throw new CustomError(400, "Insufficient data to create group!");
        const { name, courseId, teacherId, startDate, schedule, maxStudents } = data;
        if (!name || !courseId || !teacherId || !startDate || !schedule || !maxStudents) throw new CustomError(400, "Insufficient data to create group!");
        const course = await this.cService.getCourseById(courseId);
        if (!course.is_active) throw new CustomError(403, "Cannot assign group to an inactive course!");
        const teacher = await this.sService.getStaffById(teacherId);
        if (teacher.role !== 'teacher') throw new CustomError(403, "Role is not a teacher!");
        if (teacher.status === 'inactive') throw new CustomError(403, "Teacher is inactive!");
        const { rows: groups } = await client.query("INSERT INTO groups (name, course_id, teacher_id, start_date, schedule, max_students) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, start_date, schedule, max_students, status;", [name, courseId, teacherId, startDate, schedule, maxStudents]);
        return {
            success: true,
            group: {
                ...groups[0],
                course: {
                    id: course.id,
                    name: course.name
                },
                teacher: {
                    id: teacher.id,
                    staff: {
                        firstName: teacher.first_name,
                        lastName: teacher.last_name
                    }
                }
            }
        };
    }
}