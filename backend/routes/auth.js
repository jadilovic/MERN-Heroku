const express = require('express');
const router = express.Router();

const { register, login, getAllUsers } = require('../controllers/auth');

router.post('/register', register);
router.get('/allusers', getAllUsers);
router.post('/login', login);

module.exports = router;
