const express = require('express');
const router = express.Router();
const { Show } = require('../models/Show');

router.get('/', (req, res) => {
	res.json({ msg: 'Shows' });
});

module.exports = router;
