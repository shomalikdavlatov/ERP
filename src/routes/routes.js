import authRouter from './auth.router.js';
import staffsRouter from './staffs.router.js';
import studentsRouter from './students.router.js';
import teachersRouter from './teachers.router.js';

export default () => [
    ['/auth', authRouter],
    ['/staffs', staffsRouter],
    ['/students', studentsRouter],
    ['/teachers', teachersRouter]
];