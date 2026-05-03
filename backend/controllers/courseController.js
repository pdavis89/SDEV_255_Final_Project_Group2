const Course = require('../models/courseModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');

async function getProfessorId(professorId) {
  if (!professorId || !mongoose.Types.ObjectId.isValid(professorId)) {
    return null;
  }

  const professor = await User.findOne({ _id: professorId, role: 'professor' });
  return professor?._id || null;
}

// Fetch all courses from MongoDB and return them sorted by name.
async function getCourses(req, res) {
  try {
    const courses = await Course.find()
      .populate('professor', 'name email')
      .populate('enrolledStudents', 'name email')
      .sort({ name: 1 });
    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load courses.', error: error.message });
  }
}

// Fetch a single course by its MongoDB document id.
async function getCourseById(req, res) {
  try {
    const course = await Course.findById(req.params.id)
      .populate('professor', 'name email')
      .populate('enrolledStudents', 'name email');

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
    const { name, courseNumber, subject, credits, description, crn, professor } = req.body;

    if (!name || !courseNumber || !subject || credits == null || !description || !crn || !professor) {
      return res.status(400).json({
        success: false,
        message: 'Name, courseNumber, subject, credits, description, crn, and professor are required.',
      });
    }

    const professorId = await getProfessorId(professor);
    if (!professorId) {
      return res.status(400).json({ success: false, message: 'Selected professor was not found.' });
    }

    const course = await Course.create({
      name,
      courseNumber,
      subject,
      credits,
      description,
      crn,
      professor: professorId,
      enrolledStudents: [],
    });

    await course.populate('professor', 'name email');

    res.status(201).json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create course.', error: error.message });
  }
}

// Update an existing course by id with the provided fields.
async function updateCourse(req, res) {
  try {
    const allowedFields = ['name', 'courseNumber', 'subject', 'credits', 'description', 'crn', 'professor'];
    const updates = {};

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (!updates || Object.keys(updates).length === 0) {
      return res.status(400).json({ success: false, message: 'Update data is required.' });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (updates.professor) {
      const professorId = await getProfessorId(updates.professor);
      if (!professorId) {
        return res.status(400).json({ success: false, message: 'Selected professor was not found.' });
      }
      updates.professor = professorId;
    }

    Object.assign(course, updates);
    await course.save();
    await course.populate('professor', 'name email');
    await course.populate('enrolledStudents', 'name email');

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update course.', error: error.message });
  }
}

// Delete a course from MongoDB by its id.
async function deleteCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    await course.deleteOne();

    res.json({ success: true, message: 'Course deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete course.', error: error.message });
  }
}

async function enrollInCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.enrolledStudents.some(studentId => studentId.equals(req.user._id))) {
      return res.status(409).json({ success: false, message: 'You are already enrolled in this course.' });
    }

    course.enrolledStudents.push(req.user._id);
    await course.save();
    await course.populate('professor', 'name email');
    await course.populate('enrolledStudents', 'name email');

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to enroll in course.', error: error.message });
  }
}

async function dropCourse(req, res) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    course.enrolledStudents = course.enrolledStudents.filter(studentId => !studentId.equals(req.user._id));
    await course.save();
    await course.populate('professor', 'name email');
    await course.populate('enrolledStudents', 'name email');

    res.json({ success: true, course });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to drop course.', error: error.message });
  }
}

async function getMySchedule(req, res) {
  try {
    const courses = await Course.find({ enrolledStudents: req.user._id })
      .populate('professor', 'name email')
      .populate('enrolledStudents', 'name email')
      .sort({ name: 1 });

    res.json({ success: true, courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to load schedule.', error: error.message });
  }
}

module.exports = {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  dropCourse,
  getMySchedule,
};
