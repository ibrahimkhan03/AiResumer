
const { Clerk } = require('@clerk/clerk-sdk-node');

const clerk = Clerk({
  secretKey: process.env.CLERK_SECRET_KEY,
});

module.exports = clerk;