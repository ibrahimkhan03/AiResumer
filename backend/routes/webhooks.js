const express = require('express');
const { handleWebhook } = require('../controllers/webhookController');

const router = express.Router();

router.post('/clerk', handleWebhook);

module.exports = router;