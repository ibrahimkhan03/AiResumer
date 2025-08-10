const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const {
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
} = require('../controllers/resumesController');

const router = express.Router();

// Temporarily bypass auth middleware for development
// TODO: Enable auth middleware in production
// router.use(authenticateUser);

router.get('/', getAllResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

module.exports = router;
