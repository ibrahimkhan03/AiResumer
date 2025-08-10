const {
  verifyWebhook,
  handleUserCreated,
  handleUserUpdated,
  handleUserDeleted,
} = require('../lib/webhook-utils');

// handle clerk webhooks
const processWebhook = async (req, res) => {
  try {
    const payload = JSON.stringify(req.body);
    const headers = req.headers;

    // verify webhook first  
    const evt = verifyWebhook(payload, headers);

    console.log('got webhook:', evt.type); // debug

    // handle different events
    if (evt.type === 'user.created') {
      await handleUserCreated(evt.data);
    } else if (evt.type === 'user.updated') {
      await handleUserUpdated(evt.data);
    } else if (evt.type === 'user.deleted') {
      await handleUserDeleted(evt.data);
    } else {
      console.log('unknown webhook type:', evt.type); // just log it
    }

    res.json({ 
      success: true, 
      message: 'webhook processed' 
    });
  } catch (error) {
    console.log('webhook error:', error);
    res.status(400).json({ 
      error: 'webhook failed', 
      message: 'something went wrong' 
    });
  }
};

module.exports = {
  handleWebhook: processWebhook, // keep original name for compatibility
};