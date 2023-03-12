const express = require('express');
const router = express.Router();
const { Show, User } = require('../models/Show');
const { check, validationResult } = require('express-validator');

router.get('/', async (req, res) => {
	try {
		await Show.findAll()
			.then((shows) => {
				if (shows.length) {
					res.status(200).json(shows);
				} else {
					res.status(404).json('No shows found');
				}
			})
			.catch((err) => {
				res.status(500).json({ error: 'Database Internal Error', err });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error', err });
	}
});

router.get('/:id', async (req, res) => {
	try {
		let { id } = req.params;
		await Show.findByPk(id)
			.then((show) => {
				if (show) {
					res.status(200).json(show);
				} else {
					res.status(404).json('No show found');
				}
			})
			.catch((err) => {
				res.status(500).json({ error: 'Database Internal Error', err });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error', err });
	}
});

router.get('/genre/:name', async (req, res) => {
	try {
		let { name } = req.params;
		await Show.findAll({ where: { genre: name } })
			.then((shows) => {
				if (shows.length) {
					res.status(200).json(shows);
				} else {
					res.status(404).json('No shows of that genre were found');
				}
			})
			.catch((err) => {
				res.status(500).json({ error: 'Database Internal Error', err });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error', err });
	}
});

router.put(
	'/:id/rating/:rating',
	[check(['id', 'rating']).not().isEmpty().trim()],
	async (req, res) => {
		try {
			let { id, rating } = req.params;
			let fetchedShow = await Show.findByPk(id);
			if (!fetchedShow) {
				res.status(404).json('Show not found');
			} else {
				await Show.update(
					{ rating },
					{
						where: { id: fetchedShow.dataValues.id },
					}
				);
				let shows = await Show.findAll();
				res.status(201).json(shows);
			}
		} catch (err) {
			res.status(500).json({ message: 'Server Internal Error', err });
		}
	}
);

router.put(
	'/:id/status/:status',
	[
		check(['id', 'status']).not().isEmpty().trim(),
		check('status').isLength({ min: 5, max: 25 }),
	],
	async (req, res) => {
		try {
			let { id, status } = req.params;
			let fetchedShow = await Show.findByPk(id);
			if (!fetchedShow) {
				res.status(404).json('Show not found');
			} else {
				await Show.update(
					{ status },
					{
						where: { id: fetchedShow.dataValues.id },
					}
				);
				let shows = await Show.findAll();
				res.status(201).json(shows);
			}
		} catch (err) {
			res.status(500).json({ message: 'Server Internal Error', err });
		}
	}
);

router.delete('/:id', async (req, res) => {
	try {
		let { id } = req.params;
		let fetchedShow = await Show.findByPk(id);
		if (!fetchedShow) {
			res.status(404).json('Show not found');
		} else {
			await fetchedShow.destroy();
			let shows = await Show.findAll();
			res.status(201).json(shows);
		}
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error', err });
	}
});

module.exports = router;
