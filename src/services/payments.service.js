import { client } from './../config/database.js';
import CustomError from './../utils/custom.error.js';
import StudentsService from './students.service.js';
import GroupsService from './groups.service.js';

export default class PaymentsService {
    constructor() {
        this.sService = new StudentsService();
        this.gService = new GroupsService();
    }
    async createPayment(staffId, data) {
        if (!data) throw new CustomError(400, "Insufficient data to create payment!");
        const { studentId, groupId, amount, paymentDate, paymentMethod, description } = data;
        if (!studentId || !groupId || !amount || !paymentDate || !paymentMethod || !description) throw new CustomError(400, "Insufficient data to create payment!");
        const student = await this.sService.getStudentById(studentId);
        const group = await this.gService.getGroupById(groupId);
        const { rows: [payment] } = await client.query("INSERT INTO payments (student_id, group_id, amount, payment_date, payment_method, description, created_by) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, amount, payment_date, payment_method, description;", [studentId, groupId, amount, paymentDate, paymentMethod, description, staffId]);
        return {
            success: true,
            payment: {
                id: payment.id,
                student: {
                    id: student.id,
                    firstName: student.first_name,
                    lastName: student.last_name
                },
                group: {
                    id: group.id,
                    name: group.name
                },
                amount,
                paymentDate,
                paymentMethod,
                description
            }
        }
    }
}