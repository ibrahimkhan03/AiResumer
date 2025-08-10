const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// get all jobs for user
const getAllJobs = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const jobs = await prisma.job.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(jobs);
  } catch (error) {
    console.log('jobs fetch error:', error);
    res.status(500).json({ error: 'server error' });
  }
};

// get single job by id
const getJobById = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    const job = await prisma.job.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'job not found' });
    }

    res.json(job);
  } catch (error) {
    console.log('job fetch error:', error);
    res.status(500).json({ error: 'server error' });
  }
};

// create new job application
const createJob = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const {
      title,
      company,
      location,
      salary,
      status,
      jobType,
      workType,
      notes,
      jobUrl,
      contactEmail,
      applicationDate
    } = req.body;

    // basic validation
    if (!title || !company) {
      return res.status(400).json({ error: 'title and company required' });
    }

    const job = await prisma.job.create({
      data: {
        userId,
        title,
        company,
        location,
        salary,
        status: status || 'Applied',
        jobType: jobType || 'Full-time',
        workType: workType || 'On-site',
        notes,
        jobUrl,
        contactEmail,
        applicationDate: applicationDate ? new Date(applicationDate) : null
      }
    });

    res.status(201).json(job);
  } catch (error) {
    console.log('job create error:', error);
    res.status(500).json({ error: 'server error' });
  }
};

// update job application
const updateJob = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;
    const {
      title,
      company,
      location,
      salary,
      status,
      jobType,
      workType,
      notes,
      jobUrl,
      contactEmail,
      applicationDate
    } = req.body;

    // check if job exists and belongs to user
    const existingJob = await prisma.job.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'job not found' });
    }

    const updatedJob = await prisma.job.update({
      where: { id },
      data: {
        title,
        company,
        location,
        salary,
        status,
        jobType,
        workType,
        notes,
        jobUrl,
        contactEmail,
        applicationDate: applicationDate ? new Date(applicationDate) : null
      }
    });

    res.json(updatedJob);
  } catch (error) {
    console.log('job update error:', error);
    res.status(500).json({ error: 'server error' });
  }
};

// delete job application
const deleteJob = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const { id } = req.params;

    // check if job exists and belongs to user
    const existingJob = await prisma.job.findFirst({
      where: { 
        id,
        userId 
      }
    });

    if (!existingJob) {
      return res.status(404).json({ error: 'job not found' });
    }

    await prisma.job.delete({
      where: { id }
    });

    res.status(204).send();
  } catch (error) {
    console.log('job delete error:', error);
    res.status(500).json({ error: 'server error' });
  }
};

// get job stats for dashboard
const getJobStats = async (req, res) => {
  try {
    const userId = req.auth.userId;

    const totalApplications = await prisma.job.count({
      where: { userId }
    });

    const inProgress = await prisma.job.count({
      where: { 
        userId,
        status: {
          in: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Interviewed']
        }
      }
    });

    const offersReceived = await prisma.job.count({
      where: { 
        userId,
        status: 'Offer Received'
      }
    });

    const rejected = await prisma.job.count({
      where: { 
        userId,
        status: 'Rejected'
      }
    });

    const responseRate = totalApplications > 0 
      ? Math.round(((totalApplications - rejected) / totalApplications) * 100) 
      : 0;

    res.json({
      totalApplications,
      inProgress,
      offersReceived,
      responseRate
    });
  } catch (error) {
    console.log('stats error:', error);
    res.status(500).json({ error: 'server error' });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
};
