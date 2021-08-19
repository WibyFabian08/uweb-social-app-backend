const express = require('express');
const router = express.Router();

const conversationController = require('../contollers/conversationController');

router.post('/', conversationController.createConversation);
router.get('/:userId', conversationController.getConversationWithOneId);
router.get('/find/:senderId/:receiverId', conversationController.getConversationWithTwoId);


module.exports = router;