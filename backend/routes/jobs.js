const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getJobStats,
} = require('../controllers/jobsController');

const router = express.Router();

// Get all jobs for authenticated user
router.get('/', authenticateUser, getAllJobs);

// Get job by ID
router.get('/:id', authenticateUser, getJobById);

// Create new job application
router.post('/', authenticateUser, createJob);

// Update job application
router.put('/:id', authenticateUser, updateJob);

// Delete job application
router.delete('/:id', authenticateUser, deleteJob);

// Get job statistics for dashboard
router.get('/stats/overview', authenticateUser, getJobStats);

module.exports = router;
