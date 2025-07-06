import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/Debug/ErrorBoundary';
import { LoadingDiagnostics } from './components/Debug/LoadingDiagnostics';
import { runPageDiagnostics } from './utils/diagnostics';
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
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  // 检查是否已有有效的登录状态
  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('🚀 应用初始化开始...');
        
        // 运行初始诊断
        await runPageDiagnostics();
        
    const savedToken = localStorage.getItem('accessToken');
    const savedUser = localStorage.getItem('currentUser');
    
    if (savedToken && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setCurrentUser(userData);
        setIsLoggedIn(true);
      } catch (error) {
        console.error('恢复用户状态失败:', error);
        // 清除无效数据
        localStorage.removeItem('accessToken');
        localStorage.removeItem('currentUser');
      }
    }
        
        console.log('✅ 应用初始化完成');
      } catch (error) {
        console.error('❌ 应用初始化失败:', error);
        setInitError(error instanceof Error ? error.message : '初始化失败');
      } finally {
        setIsInitializing(false);
      }
    };
    
    initializeApp();
  }, []);
  const handleLogin = (userData: any) => {
    setCurrentUser(userData);
    setIsLoggedIn(true);
    
    // 保存用户信息到localStorage
    localStorage.setItem('currentUser', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('dashboard');
    
    // 清除本地存储的用户信息
    localStorage.removeItem('currentUser');
  };

  // 如果初始化失败，显示错误页面
  if (initError) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">⚠️</span>
          </div>
          <h1 className="text-xl font-bold text-red-900 mb-2">应用初始化失败</h1>
          <p className="text-red-600 mb-4">{initError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            重新加载
          </button>
        </div>
      </div>
    );
  }

  // 显示加载诊断
  if (isInitializing) {
    return <LoadingDiagnostics isLoading={true} />;
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
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