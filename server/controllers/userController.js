import pool from '../config/db.js';
import upload from '../config/multer.js';
import fs from 'fs';
import path from 'path';

const defaultImagePath = path.join(path.resolve(), 'images', 'default-profile.png');

export const getProfile = (req, res) => {
    res.json({ user: req.user });
};

export const updateUser = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(400).json({ message: err });
        }

        const { username, email } = req.body;
        const userId = req.user.id;

        let profileImageData = req.user.profile_image;

        if (req.file) {
            profileImageData = req.file.buffer;
        }

        try {
            const result = await pool.query(
                'UPDATE users SET username = $1, email = $2, profile_image = $3 WHERE id = $4 RETURNING *',
                [username, email, profileImageData, userId]
            );

            if (result.rows.length === 0) {
                console.error('User not found for ID:', userId);
                return res.status(404).json({ message: 'User not found' });
            }

            res.json({ message: 'User information updated successfully', user: result.rows[0] });
        } catch (error) {
            console.error('Error updating user information:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    });
};

export const getProfileImage = async (req, res) => {
    const userId = req.params.id;

    try {
        const result = await pool.query('SELECT profile_image FROM users WHERE id = $1', [userId]);

        if (result.rows.length === 0 || !result.rows[0].profile_image) {
            // Serve the default profile image
            res.sendFile(defaultImagePath);
            return;
        }

        res.set('Content-Type', 'image/jpeg');
        res.send(result.rows[0].profile_image);
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};