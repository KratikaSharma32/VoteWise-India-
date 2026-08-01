const express = require('express');
const router = express.Router();
const tasks = require('../data/tasks.json');
router.get('/', (req, res) => res.json({ success: true, data: tasks }));
module.exports = router;
