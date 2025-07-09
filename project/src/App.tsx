import React, { useState } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import CourseList from './components/CourseList';
import CourseBuilder from './components/CourseBuilder';
import Analytics from './components/Analytics';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'courses':
        return <CourseList onViewChange={setCurrentView} />;
      case 'builder':
        return <CourseBuilder onViewChange={setCurrentView} />;
      case 'analytics':
        return <Analytics onViewChange={setCurrentView} />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="transition-all duration-300">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;