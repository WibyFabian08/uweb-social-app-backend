const express = require('express');
const router = express.Router();
const uploadImages = require('../middlewares/uploadImages');

const userController = require('../contollers/userController');

router.get('/', userController.getUsers);
router.get('/name/:username', userController.getUserByName);
router.put('/:id', uploadImages, userController.updateUser);
router.put('/:id/cover', uploadImages, userController.updateCoverPicture);
router.delete('/:id', userController.deleteUser);
router.post('/follow/:id', userController.follow);
router.post('/unfollow/:id', userController.unFollow);
router.get('/:id', userController.getUser);

module.exports = router;