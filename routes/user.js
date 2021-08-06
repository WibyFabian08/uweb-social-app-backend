const express = require('express');
const router = express.Router();

const userController = require('../contollers/userController');

router.get('/', userController.getUsers);
router.get('/:id', userController.getUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.post('/follow/:id', userController.follow);
router.post('/unfollow/:id', userController.unFollow);

module.exports = router;