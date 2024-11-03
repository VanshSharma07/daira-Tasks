// childRoutes.js
const express = require('express');
const { 
  addChild, 
  getChild, 
  getChildrenByTeacher,
  deleteChild,
  resetStudentData
} = require('../controllers/childController');
const { verifyToken } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/addChild', verifyToken, addChild);
router.get("/getChild/:childId", verifyToken, getChild);
router.get('/getChildrenByTeacher', verifyToken, getChildrenByTeacher);
router.delete('/deleteChild/:childId', verifyToken, deleteChild);
router.post('/resetStudentData/:childId', verifyToken, resetStudentData);

module.exports = router;