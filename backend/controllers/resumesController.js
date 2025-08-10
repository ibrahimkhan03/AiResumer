const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// get all resumes for user
const getAllResumes = async (req, res) => {
  try {
    const clerkUserId = 'temp-clerk-id';
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: "temp-clerk-id",
          email: "temp@example.com",
          name: "Test User"
        }
      });
    }

    const resumes = await prisma.resume.findMany({
      where: {
        userId: user.clerkUserId
      },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true
      }
    });

    // transform to match frontend expectations
    const transformedResumes = resumes.map(resume => ({
      id: resume.id,
      resumeName: resume.title,
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt
    }));

    res.json(transformedResumes);
  } catch (error) {
    console.log('resumes fetch error:', error);
    res.status(500).json({ error: 'failed to fetch resumes' });
  }
};

// get specific resume by id
const getResumeById = async (req, res) => {
  try {
    const clerkUserId = 'temp-clerk-id';
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: "temp-clerk-id",
          email: "temp@example.com",
          name: "Test User"
        }
      });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: req.params.id,
        userId: user.clerkUserId
      }
    });

    if (!resume) {
      return res.status(404).json({ error: 'resume not found' });
    }

    // transform to match frontend expectations
    const transformedResume = {
      id: resume.id,
      resumeName: resume.title,
      personalInfo: JSON.stringify(resume.data.personalInfo || {}),
      experiences: JSON.stringify(resume.data.experiences || []),
      education: JSON.stringify(resume.data.education || []),
      skills: JSON.stringify(resume.data.skills || []),
      projects: JSON.stringify(resume.data.projects || []),
      status: resume.status,
      createdAt: resume.createdAt,
      updatedAt: resume.updatedAt
    };

    res.json(transformedResume);
  } catch (error) {
    console.log('resume fetch error:', error);
    res.status(500).json({ error: 'failed to fetch resume' });
  }
};

// create new resume
const createResume = async (req, res) => {
  try {
    const {
      resumeName,
      personalInfo,
      experiences,
      education,
      skills,
      projects,
      status = 'draft'
    } = req.body;

    // ensure user exists - create if doesn't exist
    const clerkUserId = 'temp-clerk-id';
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: "temp-clerk-id",
          email: "temp@example.com",
          name: "Test User"
        }
      });
      console.log('created temp user:', user);
    }

    const resumeData = {
      personalInfo,
      experiences,
      education,
      skills,
      projects
    };

    const resume = await prisma.resume.create({
      data: {
        userId: user.clerkUserId,
        title: resumeName || 'Untitled Resume',
        data: resumeData,
        status
      }
    });

    res.status(201).json(resume);
  } catch (error) {
    console.log('resume create error:', error);
    res.status(500).json({ error: 'failed to create resume' });
  }
};

// update resume (for auto-save and manual save)
const updateResume = async (req, res) => {
  try {
    // ensure user exists first
    const clerkUserId = 'temp-clerk-id';
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: "temp-clerk-id",
          email: "temp@example.com",
          name: "Test User"
        }
      });
    }

    const {
      resumeName,
      personalInfo,
      experiences,
      education,
      skills,
      projects,
      status
    } = req.body;

    const resume = await prisma.resume.findFirst({
      where: {
        id: req.params.id,
        userId: user.clerkUserId
      }
    });

    if (!resume) {
      return res.status(404).json({ error: 'resume not found' });
    }

    // parse existing data
    const existingData = resume.data;

    const updatedData = {
      personalInfo: personalInfo || existingData.personalInfo,
      experiences: experiences || existingData.experiences,
      education: education || existingData.education,
      skills: skills || existingData.skills,
      projects: projects || existingData.projects
    };

    const updatedResume = await prisma.resume.update({
      where: {
        id: req.params.id
      },
      data: {
        title: resumeName || resume.title,
        data: updatedData,
        status: status || resume.status,
        updatedAt: new Date()
      }
    });

    res.json(updatedResume);
  } catch (error) {
    console.log('resume update error:', error);
    res.status(500).json({ error: 'failed to update resume' });
  }
};

// delete resume
const deleteResume = async (req, res) => {
  try {
    // ensure user exists first
    const clerkUserId = 'temp-clerk-id';
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId }
    });

    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }

    const resume = await prisma.resume.findFirst({
      where: {
        id: req.params.id,
        userId: user.clerkUserId
      }
    });

    if (!resume) {
      return res.status(404).json({ error: 'resume not found' });
    }

    await prisma.resume.delete({
      where: {
        id: req.params.id
      }
    });

    res.json({ message: 'resume deleted successfully' });
  } catch (error) {
    console.log('resume delete error:', error);
    res.status(500).json({ error: 'failed to delete resume' });
  }
};

// duplicate resume
const duplicateResume = async (req, res) => {
  try {
    // ensure user exists first
    const clerkUserId = 'temp-clerk-id';
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUserId }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: "temp-clerk-id",
          email: "temp@example.com",
          name: "Test User"
        }
      });
    }

    const originalResume = await prisma.resume.findFirst({
      where: {
        id: req.params.id,
        userId: user.clerkUserId
      }
    });

    if (!originalResume) {
      return res.status(404).json({ error: 'resume not found' });
    }

    const duplicatedResume = await prisma.resume.create({
      data: {
        userId: user.clerkUserId,
        title: `${originalResume.title} (Copy)`,
        data: originalResume.data, // copy the JSON object as-is
        status: 'draft'
      }
    });

    res.status(201).json(duplicatedResume);
  } catch (error) {
    console.log('resume duplicate error:', error);
    res.status(500).json({ error: 'failed to duplicate resume' });
  }
};

module.exports = {
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
};
