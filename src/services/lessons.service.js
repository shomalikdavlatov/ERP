import { client } from './../config/database.js';
import CustomError from './../utils/custom.error.js';
import GroupService from './../services/groups.service.js'

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
        const lesson = await this.getLessonById(id);
        const { rows: attendance } = await client.query("SELECT id FROM attendance WHERE lesson_id = $1;", [id]);
        if (!attendance.length) throw new CustomError(404, "Attendance not found!");
        const result = {
            success: true,
            lesson: {
                id: lesson.id,
                title: lesson.title,
                lessonDate: lesson.lesson_date,
                group: {
                    id: lesson.group_id,
                    name: lesson.name
                }
            },
            attendance: {
                students: []
            }
        }
        const { rows: details } = await client.query("SELECT student_id, status FROM attendance_details WHERE attendance_id = $1", [attendance[0].id]);
        const count = { total: 0, present: 0, absent: 0, late: 0 };
        for (const { student_id, status } of details) {
            count.total++;
            count[status]++;
            const { rows: [student] } = await client.query("SELECT id, first_name, last_name FROM students WHERE id = $1", [student_id]);
            result.attendance.students.push({
                student: {
                    id: student,
                    firstName: student.first_name,
                    lastName: student.last_name
                },
                status
            });
        }
        result.attendance = {
            ...count,
            ...result.attendance
        };
        return result;
    }
    async createAttendancesByLessonId(id, staffId, data) {
        const lesson = await this.getLessonById(id);
        const { rows: attendance } = await client.query("INSERT INTO attendance (lesson_id, created_by) VALUES ($1, $2) RETURNING id;", [id, staffId]);
        let count = { attendanceCount: 0, present: 0, absent: 0, late: 0 };
        for (const el of data.attendances) {
            count.attendanceCount++;
            count[el.status]++;
            await client.query("INSERT INTO attendance_details (attendance_id, student_id, status, comment) VALUES ($1, $2, $3, $4);", [attendance[0].id, el.studentId, el.status, el.comment]);
        }
        return {
            success: true,
            message: "Davomat muvaffaqiyatli saqlandi",
            lesson: {
                id,
                title: lesson.title,
                lessonDate: lesson.lesson_date
            },
            ...count
        }
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