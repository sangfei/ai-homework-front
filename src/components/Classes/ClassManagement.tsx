import React, { useState } from 'react';
import { Plus, Users, GraduationCap, Edit, Trash2, Search } from 'lucide-react';

interface Class {
  id: string;
  name: string;
  grade: string;
  teacher: string;
  studentCount: number;
  subjects: string[];
  createdAt: string;
}

const ClassManagement: React.FC = () => {
  const [classes] = useState<Class[]>([
    {
      id: '1',
      name: '三年级一班',
      grade: '三年级',
      teacher: '张老师',
      studentCount: 42,
      subjects: ['数学', '语文', '英语'],
      createdAt: '2024-09-01'
    },
    {
      id: '2',
      name: '三年级二班',
      grade: '三年级',
      teacher: '李老师',
      studentCount: 38,
      subjects: ['数学', '语文', '英语'],
      createdAt: '2024-09-01'
    },
    {
      id: '3',
      name: '四年级一班',
      grade: '四年级',
      teacher: '王老师',
      studentCount: 35,
      subjects: ['数学', '语文', '英语', '科学'],
      createdAt: '2024-09-01'
    }
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">班级管理</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>新建班级</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="搜索班级..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((classItem) => (
            <div key={classItem.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">{classItem.name}</h3>
                <div className="flex items-center space-x-2">
                  <button className="p-1 text-gray-400 hover:text-blue-600">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <GraduationCap className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">{classItem.grade}</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">班主任: {classItem.teacher}</span>
                </div>
                
                <div className="flex items-center">
                  <Users className="w-4 h-4 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600">学生数: {classItem.studentCount}人</span>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {classItem.subjects.map((subject, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {subject}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm">
                  查看详情
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">新建班级</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">班级名称</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入班级名称"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">年级</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>请选择年级</option>
                  <option>一年级</option>
                  <option>二年级</option>
                  <option>三年级</option>
                  <option>四年级</option>
                  <option>五年级</option>
                  <option>六年级</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">班主任</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option>请选择班主任</option>
                  <option>张老师</option>
                  <option>李老师</option>
                  <option>王老师</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassManagement;