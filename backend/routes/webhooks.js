const express = require('express');
const { handleWebhook } = require('../controllers/webhookController');

const router = express.Router();

// Webhook endpoint for Clerk
router.post('/clerk', handleWebhook);

module.exports = router;