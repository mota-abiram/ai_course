import React, { useState } from 'react';
import { Plus, Wand2, Save, Play, FileText, Video, HelpCircle, Clock, Users } from 'lucide-react';

interface CourseBuilderProps {
  onViewChange: (view: string) => void;
}

const CourseBuilder: React.FC<CourseBuilderProps> = ({ onViewChange }) => {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [modules, setModules] = useState([
    { id: 1, title: 'Introduction', lessons: 3, duration: '45 min', type: 'video' },
    { id: 2, title: 'Core Concepts', lessons: 5, duration: '90 min', type: 'text' },
    { id: 3, title: 'Practical Applications', lessons: 4, duration: '60 min', type: 'quiz' },
  ]);

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    
    // Mock generated content
    setCourseDescription('This comprehensive course covers the fundamentals and advanced concepts, designed to take you from beginner to expert level.');
    setModules([
      { id: 1, title: 'Foundations & Setup', lessons: 4, duration: '60 min', type: 'video' },
      { id: 2, title: 'Core Principles', lessons: 6, duration: '120 min', type: 'text' },
      { id: 3, title: 'Advanced Techniques', lessons: 5, duration: '90 min', type: 'video' },
      { id: 4, title: 'Real-world Projects', lessons: 3, duration: '75 min', type: 'quiz' },
      { id: 5, title: 'Assessment & Certification', lessons: 2, duration: '30 min', type: 'quiz' },
    ]);
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'text': return FileText;
      case 'quiz': return HelpCircle;
      default: return FileText;
    }
  };

  const getModuleColor = (type: string) => {
    switch (type) {
      case 'video': return 'bg-red-100 text-red-600';
      case 'text': return 'bg-blue-100 text-blue-600';
      case 'quiz': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Course Builder</h1>
        <p className="text-gray-600 mt-2">Create engaging courses with AI-powered content generation.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Course Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
                <input
                  type="text"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                  placeholder="Enter your course title..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                  placeholder="Describe what students will learn..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleGenerateWithAI}
                disabled={!courseTitle || isGenerating}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Wand2 className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Generating...' : 'Generate with AI'}</span>
              </button>
            </div>
          </div>

          {/* Course Modules */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Course Modules</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Module</span>
              </button>
            </div>
            <div className="space-y-3">
              {modules.map((module, index) => {
                const Icon = getModuleIcon(module.type);
                return (
                  <div key={module.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-medium text-gray-900">{module.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center space-x-1">
                              <FileText className="w-4 h-4" />
                              <span>{module.lessons} lessons</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{module.duration}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleColor(module.type)}`}>
                          <Icon className="w-3 h-3 inline mr-1" />
                          {module.type}
                        </span>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Course Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Modules</span>
                <span className="font-medium">{modules.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Lessons</span>
                <span className="font-medium">{modules.reduce((sum, mod) => sum + mod.lessons, 0)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Estimated Duration</span>
                <span className="font-medium">5.5 hours</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Difficulty Level</span>
                <span className="font-medium">Beginner</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2">
                <Save className="w-4 h-4" />
                <span>Save Course</span>
              </button>
              <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Preview Course</span>
              </button>
              <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
                <Users className="w-4 h-4" />
                <span>Publish Course</span>
              </button>
            </div>
          </div>

          {/* AI Tips */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
            <h3 className="text-lg font-semibold text-purple-900 mb-2">AI Tips</h3>
            <p className="text-sm text-purple-700 mb-3">
              For better AI-generated content, include specific learning objectives and target audience in your course title.
            </p>
            <div className="flex items-start space-x-2">
              <Wand2 className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-purple-600">
                Try: "Machine Learning for Beginners: From Theory to Practice"
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;