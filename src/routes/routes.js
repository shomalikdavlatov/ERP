import authRouter from './auth.router.js';
import staffsRouter from './staffs.router.js';

export default () => [
    ['/auth', authRouter],
    ['/staffs', staffsRouter]
];