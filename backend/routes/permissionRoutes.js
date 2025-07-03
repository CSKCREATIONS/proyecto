// routes/permissionRoutes.js
const express = require('express');
const router = express.Router();
const { getAllPermissions } = require('../controllers/permissionController');
const { verifyToken } = require('../middlewares/authJwt');

router.get('/', verifyToken, getAllPermissions);

module.exports = router;
