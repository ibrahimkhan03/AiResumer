const express = require('express');
const { authenticateUser } = require('../middleware/auth');
const {
  getAllResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume,
} = require('../controllers/resumesController');

const router = express.Router();

router.get('/', getAllResumes);
router.get('/:id', getResumeById);
router.post('/', createResume);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);
router.post('/:id/duplicate', duplicateResume);

module.exports = router;
