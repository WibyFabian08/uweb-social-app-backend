const express = require('express');
const router = express.Router();
const uploadImages = require('../middlewares/uploadImages');

const postController = require('../contollers/postController');

router.post('/', uploadImages, postController.createPost);
router.put('/:id', uploadImages, postController.updatePost);
router.delete('/:id', postController.deletePost);
router.post('/:id', postController.likePost);
router.get('/:id', postController.detailPost);
router.get('/profile/:username', postController.getUserPost);
router.get('/timeline/:userId', postController.getTimeline);

module.exports = router;