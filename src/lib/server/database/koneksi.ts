import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { DATABASE_URL } from '$env/static/private';
import * as schema from './schema'; // Hapus .ts extension
import ca from './ca.pem?raw';

// Membuat koneksi pool agar efisien
const connection = mysql.createPool({
    uri: DATABASE_URL,
    ssl: {
        ca,
        rejectUnauthorized: true
    },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export const db = drizzle(connection, { schema, mode: 'default' });