const { verifyToken } = require('@clerk/backend');
const prisma = require('../lib/prisma');

/**
 * Middleware to authenticate requests using Clerk networkless verification
 */
const authenticateUser = async (req, res, next) => {
  try {
    // Get the session token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'No valid authorization header found' 
      });
    }

    const sessionToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify the session token using networkless verification
    const payload = await verifyToken(sessionToken, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });
    
    if (!payload || !payload.sub) {
      return res.status(401).json({ 
        error: 'Unauthorized', 
        message: 'Invalid session token' 
      });
    }

    const clerkUserId = payload.sub;

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) {
      // Create user if doesn't exist
      user = await prisma.user.create({
        data: {
          clerkUserId,
          email: payload.email || `user-${clerkUserId}@temp.com`,
          name: payload.name || payload.given_name || 'User',
        },
      });
    }

    // Attach user info to request object for routes to use
    req.user = user;
    req.auth = {
      userId: clerkUserId,
      sessionId: payload.sid,
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized', 
      message: 'Authentication failed' 
    });
  }
};

/**
 * Optional authentication middleware (doesn't fail if no auth)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const sessionToken = authHeader.substring(7);
      const session = await clerk.sessions.verifySession(sessionToken);
      
      if (session) {
        const user = await prisma.user.findUnique({
          where: { clerkUserId: session.userId },
        });
        
        if (user) {
          req.user = user;
          req.session = session;
          req.clerkUserId = session.userId;
        }
      }
    }
    
    next();
  } catch (error) {
    // Silent fail for optional auth
    next();
  }
};

module.exports = {
  authenticateUser,
  optionalAuth,
};