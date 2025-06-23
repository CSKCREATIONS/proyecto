const express = require('express');
const router = express.Router();
const Role = require('../models/Role');
const roleController = require('../controllers/roleController');
const { verifyToken } = require('../middlewares/authJwt');
const { checkPermission } = require('../middlewares/role');

router.get('/',
  verifyToken,
  async (req, res) => {
    try {
      const roles = await Role.find();
      res.status(200).json({ roles });
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener roles', error });
    }
  });

router.post('/',
  verifyToken,
  checkPermission('roles.crear'),
  roleController.createRole
);

module.exports = router;
