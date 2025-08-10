const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUserFromRequest = async (req) => {
  if (req.user) {
    return req.user;
  }
  
  console.warn('Auth middleware bypassed - using fallback user for development');
  
  const clerkUserId = 'dev-user-id';
  let user = await prisma.user.findUnique({
    where: { clerkUserId }
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkUserId,
        email: "dev@example.com",
        name: "Development User"
      }
    });
    console.log('Created development user:', user);
  }

  return user;
};

// get all resumes for user
const getAllResumes = async (req, res) => {
  try {
    const user = await getUserFromRequest(req);

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
    const user = await getUserFromRequest(req);

    const resume = await prisma.resume.findFirst({
      where: {
        id: req.params.id,
        userId: user.clerkUserId
      }
    });

    if (!resume) {
      return res.status(404).json({ error: 'resume not found' });
    }

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

    const user = await getUserFromRequest(req);

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
    const user = await getUserFromRequest(req);

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
    const user = await getUserFromRequest(req);

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

module.exports = {
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
};
