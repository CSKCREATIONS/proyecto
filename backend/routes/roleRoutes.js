const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const roleController = require('../controllers/roleController');
const { verifyToken } = require('../middlewares/authJwt');
const { checkPermission } = require('../middlewares/role');

router.get('/',
  verifyToken,
  checkPermission('roles.ver'),
  roleController.getAllRoles
)

router.post('/',
  verifyToken,
  checkPermission('roles.crear'),
  roleController.createRole
);

module.exports = router;
