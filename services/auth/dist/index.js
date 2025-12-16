import app from "./app.js";
import dotenv from "dotenv";
import { sql } from "./utils/db.js";
import { createClient } from "redis";
dotenv.config();
// redis connection
export const redisClient = createClient({
    url: process.env.Redis_url,
});
redisClient
    .connect()
    .then(() => console.log("✅ connected to redis"))
    .catch(console.error);
// created enum value for user role
async function initDb() {
    try {
        await sql `
        DO $$
        BEGIN
           IF NOT EXISTS (SELECT  1 FROM pg_type WHERE typname = 'user_role') THEN
               CREATE TYPE user_role AS ENUM ('jobseeker', 'recruiter');
           END IF;
        END $$;
        `;
        // created users table
        await sql `
        CREATE TABLE IF NOT EXISTS users (
            user_id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            phone_number VARCHAR(20) NOT NULL, 
            role user_role NOT NULL,
            bio TEXT,
            resume VARCHAR(255),
            resume_public_id VARCHAR(255),
            profile_pic VARCHAR(255),
            profile_pic_public_id VARCHAR(255),
            created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
            subscription TIMESTAMPTZ
        );
        `;
        // for create skills
        await sql `
        CREATE TABLE IF NOT EXISTS skills (
            skill_id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL UNIQUE
        );
        `;
        // for create user skills (to fetch skills as an array)
        await sql `
        CREATE TABLE IF NOT EXISTS user_skills (
            user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
            skill_id INT NOT NULL REFERENCES skills(skill_id) ON DELETE CASCADE,
            PRIMARY KEY (user_id, skill_id)
        );
        `;
        console.log("✅ DB Initialized Successfully");
    }
    catch (error) {
        console.log("❌ Error Initializing Database", error);
        process.exit(1);
    }
}
initDb().then(() => {
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Auth Service is running on http://localhost:${process.env.PORT || 3000}`);
    });
}).catch((error) => {
    console.log("❌ Error Initializing DB", error);
    process.exit(1);
});
