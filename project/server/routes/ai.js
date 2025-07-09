import express from 'express';
import OpenAI from 'openai';
import { body, validationResult } from 'express-validator';
import { protect } from '../middleware/auth.js';
import Course from '../models/Course.js';

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// @desc    Generate course outline
// @route   POST /api/ai/generate-outline
// @access  Private
router.post('/generate-outline', protect, [
  body('title').trim().isLength({ min: 5 }).withMessage('Title must be at least 5 characters'),
  body('description').optional().trim(),
  body('level').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid level'),
  body('category').isIn([
    'Programming', 'Data Science', 'Machine Learning', 'Web Development',
    'Mobile Development', 'DevOps', 'Design', 'Business', 'Marketing', 'Other'
  ]).withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { title, description, level, category } = req.body;

    const prompt = `Create a comprehensive course outline for a ${level} level course titled "${title}" in the ${category} category.
    ${description ? `Course description: ${description}` : ''}
    
    Please provide:
    1. A detailed course description (2-3 paragraphs)
    2. Learning outcomes (5-7 bullet points)
    3. Course modules with lessons (4-6 modules, each with 3-5 lessons)
    4. Estimated duration for each lesson
    5. Prerequisites
    6. Target audience
    
    Format the response as a JSON object with the following structure:
    {
      "description": "detailed course description",
      "learningOutcomes": ["outcome 1", "outcome 2", ...],
      "requirements": ["requirement 1", "requirement 2", ...],
      "targetAudience": "description of target audience",
      "modules": [
        {
          "title": "Module Title",
          "description": "Module description",
          "lessons": [
            {
              "title": "Lesson Title",
              "description": "Lesson description",
              "type": "video|text|quiz",
              "duration": 30
            }
          ]
        }
      ]
    }`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert course designer and educator. Create comprehensive, well-structured course outlines that provide clear learning paths for students."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    let generatedContent;
    try {
      generatedContent = JSON.parse(completion.choices[0].message.content);
    } catch (parseError) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to parse AI response'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        outline: generatedContent,
        prompt: title
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate course outline'
    });
  }
});

// @desc    Generate lesson content
// @route   POST /api/ai/generate-lesson
// @access  Private
router.post('/generate-lesson', protect, [
  body('lessonTitle').trim().isLength({ min: 3 }).withMessage('Lesson title must be at least 3 characters'),
  body('lessonType').isIn(['video', 'text', 'quiz']).withMessage('Invalid lesson type'),
  body('courseContext').optional().trim(),
  body('duration').optional().isInt({ min: 5, max: 180 }).withMessage('Duration must be between 5 and 180 minutes')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { lessonTitle, lessonType, courseContext, duration = 30 } = req.body;

    let prompt;
    
    if (lessonType === 'text') {
      prompt = `Create detailed text content for a lesson titled "${lessonTitle}".
      ${courseContext ? `Course context: ${courseContext}` : ''}
      Duration: ${duration} minutes
      
      Please provide:
      1. Lesson introduction
      2. Main content with clear sections and subsections
      3. Key concepts and definitions
      4. Practical examples
      5. Summary and key takeaways
      
      Format as structured text content suitable for online learning.`;
    } else if (lessonType === 'quiz') {
      prompt = `Create a comprehensive quiz for a lesson titled "${lessonTitle}".
      ${courseContext ? `Course context: ${courseContext}` : ''}
      
      Please provide 5-10 multiple choice questions with:
      1. Clear, concise questions
      2. 4 answer options each
      3. Correct answer indicated
      4. Brief explanation for each correct answer
      
      Format as JSON:
      {
        "questions": [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Why this answer is correct"
          }
        ]
      }`;
    } else {
      prompt = `Create a detailed script and outline for a video lesson titled "${lessonTitle}".
      ${courseContext ? `Course context: ${courseContext}` : ''}
      Duration: ${duration} minutes
      
      Please provide:
      1. Video script with timestamps
      2. Key visual elements to include
      3. Demonstrations or examples to show
      4. Interactive elements or questions to pose
      5. Summary points
      
      Format as a structured video production guide.`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert instructional designer. Create engaging, educational content that promotes active learning and knowledge retention."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    });

    let content = completion.choices[0].message.content;
    
    // Try to parse as JSON for quiz type
    if (lessonType === 'quiz') {
      try {
        content = JSON.parse(content);
      } catch (parseError) {
        // If parsing fails, return as text
      }
    }

    res.status(200).json({
      status: 'success',
      data: {
        content,
        lessonType,
        estimatedDuration: duration
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to generate lesson content'
    });
  }
});

// @desc    Improve course content
// @route   POST /api/ai/improve-content
// @access  Private
router.post('/improve-content', protect, [
  body('content').trim().isLength({ min: 10 }).withMessage('Content must be at least 10 characters'),
  body('improvementType').isIn(['clarity', 'engagement', 'structure', 'examples']).withMessage('Invalid improvement type')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { content, improvementType } = req.body;

    const improvementPrompts = {
      clarity: "Improve the clarity and readability of this educational content. Make complex concepts easier to understand while maintaining accuracy.",
      engagement: "Make this educational content more engaging and interactive. Add elements that will keep learners interested and motivated.",
      structure: "Improve the structure and organization of this educational content. Ensure logical flow and clear progression of ideas.",
      examples: "Add relevant, practical examples and use cases to this educational content to help illustrate key concepts."
    };

    const prompt = `${improvementPrompts[improvementType]}

Original content:
${content}

Please provide the improved version while maintaining the educational value and core message.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content editor. Improve content while maintaining its educational integrity and core learning objectives."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.6,
      max_tokens: 1200
    });

    const improvedContent = completion.choices[0].message.content;

    res.status(200).json({
      status: 'success',
      data: {
        originalContent: content,
        improvedContent,
        improvementType
      }
    });
  } catch (error) {
    console.error('OpenAI API Error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to improve content'
    });
  }
});

export default router;