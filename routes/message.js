const express = require('express');
const router = express.Router();

const messageController = require('../contollers/messageController');

router.post('/', messageController.createMessage);
router.get('/:conversationId', messageController.getMessage);

module.exports = router;