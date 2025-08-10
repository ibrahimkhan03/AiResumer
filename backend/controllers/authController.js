const prisma = require('../lib/prisma');
const clerk = require('../lib/clerk');

// get user profile
const getCurrentUser = async (req, res) => {
  try {
    const user = req.user; // from auth middleware
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        plan: user.plan,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log('error getting user:', error) // debug
    res.status(500).json({
      error: 'server error',
      message: 'failed to get profile',
    });
  }
};

// update user profile
const updateProfile = async (req, res) => {
  try {
    const { name, plan } = req.body;
    const userId = req.user.id;

    // basic validation
    if (plan && !['free', 'pro', 'premium'].includes(plan)) {
      return res.status(400).json({
        error: 'invalid plan',
        message: 'plan must be free, pro, or premium',
      });
    }

    // update user data
    let updateData = {};
    if (name) updateData.name = name;
    if (plan) updateData.plan = plan;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({
      success: true,
      message: 'profile updated',
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.image,
        plan: updatedUser.plan,
      },
    });
  } catch (error) {
    console.log('update error:', error);
    res.status(500).json({
      error: 'server error',
      message: 'could not update profile',
    });
  }
};

// delete user account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const clerkUserId = req.clerkUserId;

    // delete from database first
    await prisma.user.delete({
      where: { id: userId },
    });

    // then delete from clerk
    await clerk.users.deleteUser(clerkUserId);

    res.json({
      success: true,
      message: 'account deleted successfully',
    });
  } catch (error) {
    console.log('delete error:', error);
    res.status(500).json({
      error: 'server error',
      message: 'could not delete account',
    });
  }
};

// get user stats
const getUserStats = async (req, res) => {
  try {
    const user = req.user;
    
    // basic stats for now
    const stats = {
      joinDate: user.createdAt,
      plan: user.plan,
      // maybe add resume count later
    };

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.log('stats error:', error);
    res.status(500).json({
      error: 'server error',
      message: 'failed to get user stats',
    });
  }
};

module.exports = {
  getCurrentUser,
  updateProfile,
  deleteAccount,
  getUserStats,
};