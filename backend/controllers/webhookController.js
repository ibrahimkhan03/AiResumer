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

    const evt = verifyWebhook(payload, headers);

    console.log('got webhook:', evt.type);

    if (evt.type === 'user.created') {
      await handleUserCreated(evt.data);
    } else if (evt.type === 'user.updated') {
      await handleUserUpdated(evt.data);
    } else if (evt.type === 'user.deleted') {
      await handleUserDeleted(evt.data);
    } else {
      console.log('unknown webhook type:', evt.type); 
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
  handleWebhook: processWebhook,
};