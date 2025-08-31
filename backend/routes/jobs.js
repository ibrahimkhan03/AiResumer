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

router.get('/', authenticateUser, getAllJobs);
router.get('/:id', authenticateUser, getJobById);
router.post('/', authenticateUser, createJob);
router.put('/:id', authenticateUser, updateJob);
router.delete('/:id', authenticateUser, deleteJob);
router.get('/stats/overview', authenticateUser, getJobStats);

module.exports = router;
