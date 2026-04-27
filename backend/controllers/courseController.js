const Course = require('../models/courseModel');

// Fetch all courses from MongoDB and return them sorted by name.
async function getCourses(req, res) {
  try {
    const courses = await Course.find().sort({ name: 1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load courses.', error: error.message });
  }
}

// Fetch a single course by its MongoDB document id.
async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load course.', error: error.message });
  }
}

// Create a new course document in MongoDB from request body payload.
async function createCourse(req, res) {
  try {
    const { name, courseNumber, subject, credits, description, crn } = req.body;

    if (!name || !courseNumber || !subject || credits == null || !description || !crn) {
      return res.status(400).json({
        success: false,
        message: 'Name, courseNumber, subject, credits, description, and crn are required.',
      });
    }

    const course = await Course.create({
      name,
      courseNumber,
      subject,
      credits,
      description,
      crn,
    });

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create course.', error: error.message });
  }
}

// Update an existing course by id with the provided fields.
async function updateCourse(req, res) {
  try {
    const updates = req.body;

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'Update data is required.' });
    }

    const course = await Course.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update course.', error: error.message });
  }
}

// Delete a course from MongoDB by its id.
async function deleteCourse(req, res) {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    res.json({ success: true, message: 'Course deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete course.', error: error.message });
  }
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
};
