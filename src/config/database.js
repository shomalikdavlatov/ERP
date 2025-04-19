import pg from 'pg';
const { Client } = pg;

export const client = new Client({
    user: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT
});

await client.connect();

async function initTables() {
    await client.query(
        `CREATE TABLE IF NOT EXISTS staffs (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL CHECK (role IN ('superadmin', 'admin', 'teacher')),
        position VARCHAR(100) NOT NULL,
        phone VARCHAR(20),
        address TEXT,
        hire_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    );
    await client.query(
        `CREATE TABLE IF NOT EXISTS students (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE,
        password VARCHAR(255),
        phone VARCHAR(20),
        address TEXT,
        birth_date DATE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
        enrollment_date DATE DEFAULT CURRENT_DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    );
    await client.query(
        `CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        level VARCHAR(20) CHECK (level IN ('beginner', 'intermediate', 'advanced')),
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    );
    await client.query(
        `CREATE TABLE IF NOT EXISTS groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) NOT NULL,
        course_id INTEGER REFERENCES courses(id),
        teacher_id INTEGER REFERENCES staffs(id),
        start_date DATE NOT NULL,
        end_date DATE,
        schedule TEXT,
        max_students INTEGER DEFAULT 20,
        status VARCHAR(20) DEFAULT 'planned' CHECK (status IN ('planned', 'active', 'completed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    );
    await client.query(
        `CREATE TABLE IF NOT EXISTS student_groups (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        group_id INTEGER REFERENCES groups(id),
        join_date DATE DEFAULT CURRENT_DATE,
        status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(student_id, group_id)
        );`
    );
    await client.query(
        `CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id),
        title VARCHAR(255),
        description TEXT,
        lesson_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        room_number VARCHAR(20),
        created_by INTEGER REFERENCES staffs(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    );
    await client.query(
        `CREATE TABLE IF NOT EXISTS attendance (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id),
        created_by INTEGER REFERENCES staffs(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    );
    await client.query(
        `CREATE TABLE IF NOT EXISTS attendance_details (
        id SERIAL PRIMARY KEY,
        attendance_id INTEGER REFERENCES attendance(id),
        student_id INTEGER REFERENCES students(id),
        status VARCHAR(20) CHECK (status IN ('present', 'absent', 'late')),
        comment TEXT,
        UNIQUE(attendance_id, student_id)
        );`
    );
    await client.query(
        `CREATE TABLE IF NOT EXISTS payments (
        id SERIAL PRIMARY KEY,
        student_id INTEGER REFERENCES students(id),
        group_id INTEGER REFERENCES groups(id),
        amount INTEGER NOT NULL,
        payment_date DATE DEFAULT CURRENT_DATE,
        payment_method VARCHAR(20) CHECK (payment_method IN ('cash', 'card', 'transfer')),
        description TEXT,
        receipt_number VARCHAR(50),
        created_by INTEGER REFERENCES staffs(id),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`
    );
    await client.query(
        `CREATE TABLE IF NOT EXISTS schedule (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES groups(id),
        day VARCHAR(10) CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        room_number VARCHAR(20),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(group_id, day, start_time)
        );`
    );
}

await initTables();

console.log("Database connected!");