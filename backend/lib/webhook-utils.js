const { Webhook } = require('svix');
const prisma = require('./prisma');

const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);


// Verify webhook signature

const verifyWebhook = (payload, headers) => {
  try {
    return webhook.verify(payload, headers);
  } catch (error) {
    console.error('Webhook verification failed:', error.message);
    throw new Error('Invalid webhook signature');
  }
};


// Handle user creation

const handleUserCreated = async (userData) => {
  try {
    const user = await prisma.user.create({
      data: {
        clerkUserId: userData.id,
        email: userData.email_addresses[0]?.email_address,
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null,
        image: userData.image_url,
      },
    });
    console.log('User created:', user.id);
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};


// Handle user updates

const handleUserUpdated = async (userData) => {
  try {
    const user = await prisma.user.update({
      where: { clerkUserId: userData.id },
      data: {
        email: userData.email_addresses[0]?.email_address,
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || null,
        image: userData.image_url,
      },
    });
    console.log('User updated:', user.id);
    return user;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};


// Handle user deletion

const handleUserDeleted = async (userData) => {
  try {
    const user = await prisma.user.delete({
      where: { clerkUserId: userData.id },
    });
    console.log('User deleted:', user.id);
    return user;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

module.exports = {
  verifyWebhook,
  handleUserCreated,
  handleUserUpdated,
  handleUserDeleted,
};