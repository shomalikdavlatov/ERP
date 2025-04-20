import authRouter from './auth.router.js';
import staffsRouter from './staffs.router.js';
import studentsRouter from './students.router.js';
import teachersRouter from './teachers.router.js';
import coursesRouter from './courses.router.js';
import groupsRouter from './groups.router.js';
import lessonsRouter from './lessons.router.js';

export default () => [
    ['/auth', authRouter],
    ['/staffs', staffsRouter],
    ['/students', studentsRouter],
    ['/teachers', teachersRouter],
    ['/courses', coursesRouter],
    ['/groups', groupsRouter],
    ['/lessons', lessonsRouter]
];