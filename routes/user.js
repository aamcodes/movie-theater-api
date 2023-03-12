const express = require('express');
const router = express.Router();
const { User, Show } = require('../models/index');

router.get('/', async (req, res) => {
	try {
		await User.findAll()
			.then((users) => {
				if (users.length) {
					res.status(200).json(users);
				} else {
					res.status(404).json('No users found');
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
		await User.findByPk(id)
			.then((user) => {
				if (user) {
					res.status(200).json(user);
				} else {
					res.status(404).json('No user found');
				}
			})
			.catch((err) => {
				res.status(500).json({ error: 'Database Internal Error', err });
			});
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error', err });
	}
});

router.get('/watched/:userId', async (req, res) => {
	try {
		let { userId } = req.params;
		let fetchedUser = await User.findByPk(userId);
		if (!fetchedUser) {
			res.status(404).json('User not found');
		} else {
			let result = await Show.findAll({
				where: { userId: fetchedUser.dataValues.id },
			});
			if (!result.length) {
				res.status(404).json(
					'The provided user has not watched any shows'
				);
			} else {
				res.status(200).json(result);
			}
		}
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error', err });
	}
});

router.put('/:userId/:showId', async (req, res) => {
	try {
		let { userId, showId } = req.params;
		let fetchedUser = await User.findByPk(userId);
		if (!fetchedUser) {
			res.status(404).json({ error: 'User not found' });
		} else {
			let fetchedShow = await Show.findByPk(showId);
			if (!fetchedShow) {
				res.status(404).json({ error: 'Show not found' });
			} else {
				// Both the User and Show Exist
				await fetchedUser.addShow(fetchedShow.dataValues.id);
				let result = await Show.findAll({
					where: { userId: fetchedUser.dataValues.id },
					include: { model: User },
				});
				res.status(201).json(result);
			}
		}
	} catch (err) {
		res.status(500).json({ message: 'Server Internal Error', err });
	}
});

module.exports = router;
