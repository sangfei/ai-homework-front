import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/Auth/LoginPage';
import Header from './components/Layout/Header';
import Sidebar from './components/Layout/Sidebar';
import DashboardStats from './components/Dashboard/DashboardStats';
import HomeworkList from './components/Homework/HomeworkList';
import CreateHomework from './components/Homework/CreateHomework';
import HomeworkGrading from './components/Homework/HomeworkGrading';
import HomeworkGradingDetail from './components/Homework/HomeworkGradingDetail';
import OverallAnalysis from './components/Homework/OverallAnalysis';
import StudentPersonalReport from './components/Reports/StudentPersonalReport';
import ClassManagement from './components/Classes/ClassManagement';
import StudentManagement from './components/Students/StudentManagement';
import Analytics from './components/Analytics/Analytics';
import StudentReports from './components/Reports/StudentReports';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/homework/create" element={<CreateHomework />} />
          <Route path="/homework/grading/:homeworkId" element={<HomeworkGrading />} />
          <Route path="/homework/grading/:homeworkId/student/:studentId" element={<HomeworkGradingDetail />} />
          <Route path="/homework/grading/:homeworkId/analysis" element={<OverallAnalysis />} />
          <Route path="/student-report/:studentId" element={<StudentPersonalReport />} />
          <Route path="/*" element={
            <div className="flex">
              <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header currentUser={currentUser} onLogout={handleLogout} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
                  <div className="container mx-auto px-6 py-8">
                    <Routes>
                      <Route path="/" element={
                        <div className="space-y-6">
                          <div>
                            <h1 className="text-2xl font-bold text-gray-900">欢迎回来，{currentUser.name}！</h1>
                            <p className="text-gray-600">今天是个美好的教学日，让我们一起帮助学生成长。</p>
                          </div>
                          <DashboardStats />
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">今日待办</h3>
                              <div className="space-y-3">
                                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                                  <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
                                  <span className="text-sm text-gray-700">批改三年级数学作业 (36份)</span>
                                </div>
                                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                                  <span className="text-sm text-gray-700">准备明日课程内容</span>
                                </div>
                                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                  <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
                                  <span className="text-sm text-gray-700">家长会准备材料</span>
                                </div>
                              </div>
                            </div>
                            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                              <h3 className="text-lg font-semibold text-gray-900 mb-4">最新通知</h3>
                              <div className="space-y-3">
                                <div className="p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">
                                  <p className="text-sm text-gray-700">系统升级将于今晚22:00-24:00进行</p>
                                  <p className="text-xs text-gray-500 mt-1">2小时前</p>
                                </div>
                                <div className="p-3 border-l-4 border-green-400 bg-green-50 rounded-r-lg">
                                  <p className="text-sm text-gray-700">新功能：智能批改系统已上线</p>
                                  <p className="text-xs text-gray-500 mt-1">1天前</p>
                                </div>
                                <div className="p-3 border-l-4 border-orange-400 bg-orange-50 rounded-r-lg">
                                  <p className="text-sm text-gray-700">月度教学质量报告可查看</p>
                                  <p className="text-xs text-gray-500 mt-1">3天前</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      } />
                      <Route path="/homework" element={<HomeworkList />} />
                      <Route path="/classes" element={<ClassManagement />} />
                      <Route path="/students" element={<StudentManagement />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/reports" element={<StudentReports />} />
                      <Route path="*" element={
                        <div className="flex items-center justify-center h-64">
                          <div className="text-center">
                            <h2 className="text-xl font-semibold text-gray-900">功能开发中</h2>
                            <p className="text-gray-600 mt-2">该功能正在开发中，敬请期待！</p>
                          </div>
                        </div>
                      } />
                    </Routes>
                  </div>
                </main>
              </div>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

// 导航组件，用于处理侧边栏导航
const NavigationWrapper: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  currentUser: any;
  onLogout: () => void;
  children: React.ReactNode;
}> = ({ activeTab, onTabChange, currentUser, onLogout, children }) => {
  return (
    <div className="flex">
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header currentUser={currentUser} onLogout={onLogout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

// 仪表板组件
const Dashboard: React.FC<{ currentUser: any }> = ({ currentUser }) => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">欢迎回来，{currentUser.name}！</h1>
        <p className="text-gray-600">今天是个美好的教学日，让我们一起帮助学生成长。</p>
      </div>
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">今日待办</h3>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">批改三年级数学作业 (36份)</span>
            </div>
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">准备明日课程内容</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">家长会准备材料</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">最新通知</h3>
          <div className="space-y-3">
            <div className="p-3 border-l-4 border-blue-400 bg-blue-50 rounded-r-lg">
              <p className="text-sm text-gray-700">系统升级将于今晚22:00-24:00进行</p>
              <p className="text-xs text-gray-500 mt-1">2小时前</p>
            </div>
            <div className="p-3 border-l-4 border-green-400 bg-green-50 rounded-r-lg">
              <p className="text-sm text-gray-700">新功能：智能批改系统已上线</p>
              <p className="text-xs text-gray-500 mt-1">1天前</p>
            </div>
            <div className="p-3 border-l-4 border-orange-400 bg-orange-50 rounded-r-lg">
              <p className="text-sm text-gray-700">月度教学质量报告可查看</p>
              <p className="text-xs text-gray-500 mt-1">3天前</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 未找到页面组件
const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900">功能开发中</h2>
        <p className="text-gray-600 mt-2">该功能正在开发中，敬请期待！</p>
      </div>
    </div>
  );
};

export default App;