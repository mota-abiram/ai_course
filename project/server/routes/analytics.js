import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get instructor dashboard analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Instructor)
router.get('/dashboard', protect, async (req, res) => {
  try {
    const instructorId = req.user.id;

    // Get instructor's courses
    const courses = await Course.find({ instructor: instructorId });
    const courseIds = courses.map(course => course._id);

    // Calculate basic metrics
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.status === 'published').length;
    const draftCourses = courses.filter(course => course.status === 'draft').length;

    // Calculate total enrollments
    const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollments.length, 0);

    // Calculate total revenue (mock calculation)
    const totalRevenue = courses.reduce((sum, course) => {
      return sum + (course.enrollments.length * course.price);
    }, 0);

    // Calculate average rating
    const coursesWithRatings = courses.filter(course => course.ratings.length > 0);
    const averageRating = coursesWithRatings.length > 0
      ? coursesWithRatings.reduce((sum, course) => sum + course.averageRating, 0) / coursesWithRatings.length
      : 0;

    // Get top performing courses
    const topCourses = courses
      .filter(course => course.status === 'published')
      .sort((a, b) => b.enrollments.length - a.enrollments.length)
      .slice(0, 5)
      .map(course => ({
        id: course._id,
        title: course.title,
        enrollments: course.enrollments.length,
        revenue: course.enrollments.length * course.price,
        rating: course.averageRating,
        completionRate: calculateCompletionRate(course)
      }));

    // Calculate monthly enrollment trends (mock data for last 6 months)
    const enrollmentTrends = generateEnrollmentTrends(courses);

    // Recent activity
    const recentActivity = generateRecentActivity(courses);

    res.status(200).json({
      status: 'success',
      data: {
        overview: {
          totalCourses,
          publishedCourses,
          draftCourses,
          totalEnrollments,
          totalRevenue,
          averageRating: Math.round(averageRating * 10) / 10
        },
        topCourses,
        enrollmentTrends,
        recentActivity,
        courseStats: {
          byCategory: getCoursesByCategory(courses),
          byLevel: getCoursesByLevel(courses),
          byStatus: {
            published: publishedCourses,
            draft: draftCourses,
            archived: courses.filter(course => course.status === 'archived').length
          }
        }
      }
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// @desc    Get course-specific analytics
// @route   GET /api/analytics/course/:id
// @access  Private (Instructor - own courses only)
router.get('/course/:id', protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('enrollments.student', 'name email createdAt')
      .populate('ratings.student', 'name avatar');

    if (!course) {
      return res.status(404).json({
        status: 'error',
        message: 'Course not found'
      });
    }

    // Check if user owns the course
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'error',
        message: 'Not authorized to view this course analytics'
      });
    }

    // Calculate detailed metrics
    const totalEnrollments = course.enrollments.length;
    const completionRate = calculateCompletionRate(course);
    const averageProgress = calculateAverageProgress(course);
    const revenue = totalEnrollments * course.price;

    // Enrollment trends over time
    const enrollmentsByMonth = getEnrollmentsByMonth(course.enrollments);

    // Student progress distribution
    const progressDistribution = getProgressDistribution(course.enrollments);

    // Rating breakdown
    const ratingBreakdown = getRatingBreakdown(course.ratings);

    // Recent enrollments
    const recentEnrollments = course.enrollments
      .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
      .slice(0, 10);

    res.status(200).json({
      status: 'success',
      data: {
        course: {
          id: course._id,
          title: course.title,
          status: course.status
        },
        metrics: {
          totalEnrollments,
          completionRate,
          averageProgress,
          revenue,
          averageRating: course.averageRating,
          totalRatings: course.ratings.length
        },
        enrollmentsByMonth,
        progressDistribution,
        ratingBreakdown,
        recentEnrollments
      }
    });
  } catch (error) {
    console.error('Course analytics error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Server error'
    });
  }
});

// Helper functions
function calculateCompletionRate(course) {
  if (course.enrollments.length === 0) return 0;
  
  const completedStudents = course.enrollments.filter(enrollment => enrollment.progress >= 100).length;
  return Math.round((completedStudents / course.enrollments.length) * 100);
}

function calculateAverageProgress(course) {
  if (course.enrollments.length === 0) return 0;
  
  const totalProgress = course.enrollments.reduce((sum, enrollment) => sum + enrollment.progress, 0);
  return Math.round(totalProgress / course.enrollments.length);
}

function generateEnrollmentTrends(courses) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    month,
    enrollments: Math.floor(Math.random() * 100) + 20
  }));
}

function generateRecentActivity(courses) {
  const activities = [
    'enrolled in',
    'completed',
    'left a review for',
    'started'
  ];
  
  return Array.from({ length: 10 }, (_, i) => ({
    id: i,
    user: `Student ${i + 1}`,
    action: activities[Math.floor(Math.random() * activities.length)],
    course: courses[Math.floor(Math.random() * courses.length)]?.title || 'Sample Course',
    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
  }));
}

function getCoursesByCategory(courses) {
  const categories = {};
  courses.forEach(course => {
    categories[course.category] = (categories[course.category] || 0) + 1;
  });
  return categories;
}

function getCoursesByLevel(courses) {
  const levels = {};
  courses.forEach(course => {
    levels[course.level] = (levels[course.level] || 0) + 1;
  });
  return levels;
}

function getEnrollmentsByMonth(enrollments) {
  const monthlyData = {};
  enrollments.forEach(enrollment => {
    const month = new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    monthlyData[month] = (monthlyData[month] || 0) + 1;
  });
  return monthlyData;
}

function getProgressDistribution(enrollments) {
  const ranges = {
    '0-25%': 0,
    '26-50%': 0,
    '51-75%': 0,
    '76-99%': 0,
    '100%': 0
  };

  enrollments.forEach(enrollment => {
    const progress = enrollment.progress;
    if (progress === 100) ranges['100%']++;
    else if (progress >= 76) ranges['76-99%']++;
    else if (progress >= 51) ranges['51-75%']++;
    else if (progress >= 26) ranges['26-50%']++;
    else ranges['0-25%']++;
  });

  return ranges;
}

function getRatingBreakdown(ratings) {
  const breakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  ratings.forEach(rating => {
    breakdown[rating.rating]++;
  });
  return breakdown;
}

export default router;