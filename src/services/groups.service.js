import { client } from './../config/database.js';
import CustomError from './../utils/custom.error.js';
import CoursesService from './courses.service.js';
import StaffsService from './staffs.service.js';

export default class GroupsService {
    constructor() {
        this.cService = new CoursesService();
        this.sService = new StaffsService();
    }
    async createGroup(data) {
        if (!data) throw new CustomError(400, "Insufficient data to create group!");
        const { name, courseId, teacherId, startDate, schedule, maxStudents } = data;
        if (!name || !courseId || !teacherId || !startDate || !schedule || !maxStudents) throw new CustomError(400, "Insufficient data to create group!");
        const course = await this.cService.getCourseById(+courseId);
        if (!Object.keys(course).length) throw new CustomError(404, "Course not found!");
        if (!course.is_active) throw new CustomError(403, "Cannot assign group to an inactive course!");
        const teacher = await this.sService.getStaffById(+teacherId);
        if (!Object.keys(teacher).length) throw new CustomError(404, "Teacher not found!");
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