const express = require('express');
const multer = require('multer');
const { registerUser, loginUser, getdata } = require('../controllers/userController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/register', upload.single('certificateUpload'), registerUser);
router.post('/login', loginUser);
router.get('/data', getdata);

module.exports = router;
