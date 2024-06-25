// server/models/userModel.js
import pool from '../config/db.js';

export const createUser = async (username, email, passwordHash) => {
    const result = await pool.query(
        'INSERT INTO users (username, email, password, profile_image) VALUES ($1, $2, $3, $4) RETURNING *',
        [username, email, passwordHash, '/uploads/default-profile.png']
    );
    return result.rows[0];
};

export const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

export const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
};

export const updateUserById = async (id, username, email, profileImagePath) => {
    const result = await pool.query(
        'UPDATE users SET username = $1, email = $2, profile_image = $3 WHERE id = $4 RETURNING *',
        [username, email, profileImagePath, id]
    );
    return result.rows[0];
};