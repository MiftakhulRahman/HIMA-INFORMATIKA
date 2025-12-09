import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

async function seed() {
	console.log('🌱 Seeding database...');

	const connection = await mysql.createConnection({
		host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
		port: 4000,
		user: '3kVo5eGYqYJ1wZr.root',
		password: 'loS3fziUIAG069YO',
		database: 'test',
		ssl: {
			ca: fs.readFileSync(path.resolve('src/lib/server/database/ca.pem')).toString(),
			rejectUnauthorized: true
		}
	});

	const db = drizzle(connection);

	// Hash password
	const hashedPassword = await bcrypt.hash('admin123', 10);

	try {
		await connection.execute(
			`INSERT INTO admin_users (username, email, password, nama_lengkap) VALUES (?, ?, ?, ?)`,
			['admin', 'admin@hima.ac.id', hashedPassword, 'Administrator']
		);

		console.log('✅ Admin user created:');
		console.log('   Username: admin');
		console.log('   Password: admin123');
		console.log('');
		console.log('⚠️  PENTING: Segera ubah password setelah login!');
	} catch (error: any) {
		if (error.code === 'ER_DUP_ENTRY') {
			console.log('ℹ️  Admin user already exists, skipping...');
		} else {
			throw error;
		}
	}

	await connection.end();
	console.log('✅ Seeding completed!');
	process.exit(0);
}

seed().catch((err) => {
	console.error('❌ Seeding failed:', err);
	process.exit(1);
});
