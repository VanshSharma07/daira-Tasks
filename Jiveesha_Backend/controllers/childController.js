// childController.js
const Child = require("../models/child");
const Test = require("../models/test"); // Add this if not already imported

exports.addChild = async (req, res) => {
  const { name, rollno, age } = req.body;
  const teacherId = req.userId;

  try {
    const child = new Child({
      name,
      rollno,
      age,
      teacher_id: teacherId,
    });
    await child.save();
    res.status(201).json(child); // Return the created child object
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add delete child function
exports.deleteChild = async (req, res) => {
  const { childId } = req.params;
  const teacherId = req.userId;

  try {
    // Find and delete the child, ensuring it belongs to the teacher
    const child = await Child.findOneAndDelete({ 
      _id: childId,
      teacher_id: teacherId 
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found or unauthorized" });
    }

    // Also delete all associated tests
    await Test.deleteMany({ child_id: childId });

    res.status(200).json({ message: "Child and associated data deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add reset child data function
exports.resetStudentData = async (req, res) => {
  const { childId } = req.params;
  const teacherId = req.userId;

  try {
    // Verify child belongs to teacher
    const child = await Child.findOne({ 
      _id: childId,
      teacher_id: teacherId 
    });

    if (!child) {
      return res.status(404).json({ message: "Child not found or unauthorized" });
    }

    // Delete all tests associated with the child
    await Test.deleteMany({ child_id: childId });

    // Reset the tests_taken counter to 0
    await Child.findByIdAndUpdate(childId, { 
      tests_taken: 0 
    }, { new: true });

    // Return updated child data
    const updatedChild = await Child.findById(childId);
    
    res.status(200).json({ 
      message: "Student data reset successfully",
      child: updatedChild
    });

  } catch (error) {
    console.error("Reset student data error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Keep existing functions...
exports.getChild = async (req, res) => {
  const { childId } = req.params;
  try {
    const child = await Child.findOne({ _id: childId });
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }
    res.status(200).json({ child });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getChildrenByTeacher = async (req, res) => {
  const teacherId = req.userId;
  try {
    const children = await Child.find({ teacher_id: teacherId });
    res.status(200).json({ children });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};