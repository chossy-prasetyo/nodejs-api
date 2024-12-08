require('dotenv').config()
const express = require('express')
const mysql = require('mysql2')
const now_datetime = require('./time')
const app = express()
const PORT = process.env.PORT

const db_pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
})

app.use(express.json())

app.get('/users', (req, res) => {
	db_pool.execute(`SELECT * FROM users WHERE deleted_at IS NULL ORDER BY nama ASC`, (err, rows) => {
		res.json({
			code: '200',
			status: 'Success',
			total: rows.length,
			data: rows
		})
	})
})





app.post('/users', (req, res) => {
	let error = {}
	const {nama, email} = req.body
	if (! nama) error.nama = ['Nama tidak boleh kosong']
	if (! email) error.email = ['E-Mail tidak boleh kosong']

	if (Object.keys(error).length) {
		res.status(400).json({
			code: '400',
			status: 'Bad Request',
			error
		})
	}
	else
	{
		db_pool.execute(`SELECT email FROM users WHERE deleted_at IS NULL AND email = '${email}'`, (err, rows) => {
			if (rows.length) {
				res.status(400).json({
					code: '400',
					status: 'Bad Request',
					error: {
						email: ['E-Mail sudah terdaftar']
					}
				})
			}
			else {	
				db_pool.execute(`INSERT INTO users (nama, email) VALUES ('${nama}', '${email}')`)
				res.json({
					code: '200',
					status: 'Success',
					message: 'User berhasil ditambahkan'
				})
			}
		})
	}
})





app.patch('/users/:id', (req, res) => {
	const id = req.params.id
	const {nama, email} = req.body

	db_pool.execute(`SELECT nama FROM users WHERE id = ${id} AND deleted_at IS NULL`, (err, rows) => {
		if (! rows.length) {
			res.status(404).json({
				code: '404',
				status: 'Not Found',
				message: 'User tidak ditemukan'
			})
		}
		else
		{
			let error = {}
			if (! nama) error.nama = ['Nama tidak boleh kosong']
			if (! email) error.email = ['E-Mail tidak boleh kosong']

			if (Object.keys(error).length) {
				res.status(400).json({
					code: '400',
					status: 'Bad Request',
					error
				})
			}
			else
			{
				db_pool.execute(`SELECT email FROM users WHERE id != ${id} AND email = '${email}' AND deleted_at IS NULL`, (err, rows) => {
					if (rows.length) {
						res.status(400).json({
							code: '400',
							status: 'Bad Request',
							message: 'E-Mail sudah terdaftar'
						})
					}
					else {	
						db_pool.execute(`UPDATE users SET nama = '${nama}', email = '${email}' WHERE id = ${id}`)
						res.json({
							code: '200',
							status: 'Success',
							message: 'User berhasil diupdate'
						})
					}
				})
			}
		}
	})
})





app.delete('/users/:id', (req, res) => {
	const id = req.params.id

	db_pool.execute(`SELECT nama FROM users WHERE id = ${id} AND deleted_at IS NULL`, (err, rows) => {
		if (! rows.length) {
			res.status(404).json({
				code: '404',
				status: 'Not Found',
				message: 'User tidak ditemukan'
			})
		}
		else {
			db_pool.execute(`UPDATE users SET deleted_at = '${now_datetime()}' WHERE id = ${id}`)
			res.json({
				code: '200',
				status: 'Success',
				message: 'User berhasil dihapus'
			})
		}
	})
})

app.listen(PORT, () => {
	console.log(`Listening on port ${PORT}..`)
})