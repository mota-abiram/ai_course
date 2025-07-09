import React from 'react';
import { TrendingUp, Users, BookOpen, DollarSign, Calendar, Award, Eye, Download } from 'lucide-react';

interface AnalyticsProps {
  onViewChange: (view: string) => void;
}

const Analytics: React.FC<AnalyticsProps> = ({ onViewChange }) => {
  const metrics = [
    { 
      label: 'Total Revenue', 
      value: '$24,567', 
      change: '+12.5%', 
      trend: 'up',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    { 
      label: 'Total Enrollments', 
      value: '3,421', 
      change: '+8.2%', 
      trend: 'up',
      icon: Users,
      color: 'bg-blue-500'
    },
    { 
      label: 'Course Completions', 
      value: '2,987', 
      change: '+15.3%', 
      trend: 'up',
      icon: Award,
      color: 'bg-purple-500'
    },
    { 
      label: 'Active Courses', 
      value: '12', 
      change: '+2', 
      trend: 'up',
      icon: BookOpen,
      color: 'bg-orange-500'
    },
  ];

  const topCourses = [
    { name: 'Machine Learning Fundamentals', revenue: '$8,234', students: 1234, completion: 87 },
    { name: 'Advanced React Patterns', revenue: '$6,789', students: 856, completion: 92 },
    { name: 'Full-Stack Development', revenue: '$5,432', students: 2156, completion: 78 },
    { name: 'Data Science Bootcamp', revenue: '$4,112', students: 672, completion: 85 },
  ];

  const recentActivity = [
    { user: 'John Smith', action: 'completed', course: 'Machine Learning Fundamentals', time: '2 hours ago' },
    { user: 'Sarah Johnson', action: 'enrolled in', course: 'Advanced React Patterns', time: '4 hours ago' },
    { user: 'Mike Davis', action: 'left a review for', course: 'Data Science Bootcamp', time: '6 hours ago' },
    { user: 'Emma Wilson', action: 'completed', course: 'Full-Stack Development', time: '8 hours ago' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
            <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last year</option>
            </select>
          </div>
        </div>
        <p className="text-gray-600">Track your course performance and student engagement.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center space-x-1 text-sm font-medium ${
                metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                <TrendingUp className="w-4 h-4" />
                <span>{metric.change}</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{metric.value}</h3>
            <p className="text-sm text-gray-600 mt-1">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="h-64 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-600">Revenue chart visualization</p>
              <p className="text-sm text-gray-500 mt-1">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Course Views</p>
                  <p className="text-sm text-gray-600">Total page views</p>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">15,234</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">New Students</p>
                  <p className="text-sm text-gray-600">This month</p>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">342</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Avg. Session</p>
                  <p className="text-sm text-gray-600">Time per session</p>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-900">24m</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Performing Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Courses</h3>
          <div className="space-y-4">
            {topCourses.map((course, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">{course.name}</p>
                    <p className="text-sm text-gray-600">{course.students} students</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{course.revenue}</p>
                  <p className="text-sm text-gray-600">{course.completion}% completion</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.user}</span> {activity.action}{' '}
                    <span className="font-medium">{activity.course}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;