import React, { useState, useEffect } from 'react'
import axios from 'axios'

interface GenerateRequest {
  subject: string
  grade: string
  volume: string
  title: string
}

interface GenerateResponse {
  success: boolean
  message: string
  data?: {
    id: string
    subject: string
    grade: string
    volume: string
    title: string
    content: {
      overview: string
      concepts: string[]
      formulas: string[]
      diagrams: string[]
      exercises: string[]
    }
    createdAt: string
    university?: string
    motto?: string
  }
}

const TsinghuaCoursewareGenerator: React.FC = () => {
  const [formData, setFormData] = useState<GenerateRequest>({
    subject: '',
    grade: '',
    volume: '',
    title: ''
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [showForm, setShowForm] = useState(false)

  const subjects = [
    { id: 'chinese', name: '语文', icon: '📚' },
    { id: 'math', name: '数学', icon: '🔢' },
    { id: 'english', name: '英语', icon: '🌍' },
    { id: 'physics', name: '物理', icon: '⚛️' },
    { id: 'chemistry', name: '化学', icon: '🧪' },
    { id: 'politics', name: '政治', icon: '🏛️' },
    { id: 'history', name: '历史', icon: '📜' },
    { id: 'geography', name: '地理', icon: '🌏' },
    { id: 'biology', name: '生物', icon: '🧬' }
  ]

  const grades = [
    { id: 'grade1', name: '高一' },
    { id: 'grade2', name: '高二' },
    { id: 'grade3', name: '高三' }
  ]

  const volumes = [
    { id: 'volume1', name: '上册' },
    { id: 'volume2', name: '下册' }
  ]

  // 高一数学课程大纲
  const mathCurriculum = `高一数学第一册
第一章 集合与常用逻辑用语
1.1 集合的概念
1.2 集合间的基本关系
1.3 集合的基本运算
1.4 充分条件与必要条件
1.5 全称量词与存在量词

第二章 一元二次函数、方程和不等式
2.1 等式性质与不等式性质
2.2 基本不等式
2.3 二次函数与一元二次方程、不等式

第三章 函数概念与性质
3.1 函数的概念及其表示
3.2 函数的基本性质
3.3 幂函数
3.4 函数的应用（一）

第四章 指数函数与对数函数
4.1 指数
4.2 指数函数
4.3 对数
4.4 对数函数
4.5 函数的应用（二）
数学建模 建立函数模型解决实际问题

第五章 三角函数
5.1 任意角和弧度制
5.2 三角函数的概念
5.3 诱导公式
5.4 三角函数的图象与性质
5.5 三角恒等变换
5.6 函数 y=Asin（ωx＋φ）
5.7 三角函数的应用`

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.grade || !formData.volume || !formData.title) {
      setError('请填写所有必填字段')
      return
    }

    setLoading(true)
    setError('')
    setResult(null)

    try {
      const response = await axios.post<GenerateResponse>('/api/generate', formData)
      setResult(response.data)
    } catch (err) {
      setError('生成课件失败，请稍后重试')
      console.error('生成错误:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      subject: '',
      grade: '',
      volume: '',
      title: ''
    })
    setResult(null)
    setError('')
    setShowForm(false)
  }

  const startGeneration = () => {
    setShowForm(true)
    // 预填充数学课程内容
    setFormData({
      subject: 'math',
      grade: 'grade1',
      volume: 'volume1',
      title: mathCurriculum
    })
  }

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        {/* 清华大学背景元素 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-white bg-opacity-5 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-white bg-opacity-5 rounded-full"></div>
        </div>

        <div className="relative z-10 container mx-auto px-6 py-12">
          {/* 清华大学校徽和标题 */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center mb-6">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mr-4 shadow-lg">
                <div className="text-purple-800 font-bold text-2xl">清华</div>
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-2">智能高中课件生成系统</h1>
                <p className="text-purple-200 text-lg">自强不息，厚德载物</p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <p className="text-xl text-white mb-8 leading-relaxed">
                这是一个智能高中课件生成系统，支持高中所有学科的课件自动生成。
                包括语文、数学、英语、物理、化学、政治、历史、地理和生物。
              </p>
              
              {/* 学科展示 */}
              <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mb-12">
                {subjects.map(subject => (
                  <div key={subject.id} className="bg-white bg-opacity-20 rounded-lg p-4 text-center backdrop-blur-sm">
                    <div className="text-3xl mb-2">{subject.icon}</div>
                    <div className="text-white font-medium">{subject.name}</div>
                  </div>
                ))}
              </div>

              {/* 清华建筑元素 */}
              <div className="flex justify-center items-center mb-8 space-x-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">🏛️</span>
                  </div>
                  <p className="text-purple-200 text-sm">大礼堂</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-t from-red-600 to-red-400 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">📚</span>
                  </div>
                  <p className="text-purple-200 text-sm">图书馆</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-t from-green-600 to-green-400 rounded-lg mb-2 flex items-center justify-center">
                    <span className="text-white font-bold">🌸</span>
                  </div>
                  <p className="text-purple-200 text-sm">荷塘月色</p>
                </div>
              </div>

              <button
                onClick={startGeneration}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                🚀 开始生成课件
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* 顶部导航 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-bold">清华</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">智能课件生成系统</h1>
              <p className="text-purple-600 text-sm">Tsinghua University</p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
          >
            返回首页
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
            <span className="mr-3">📝</span>
            课件生成器
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学科 <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">请选择学科</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.icon} {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  年级 <span className="text-red-500">*</span>
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">请选择年级</option>
                  {grades.map(grade => (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  册别 <span className="text-red-500">*</span>
                </label>
                <select
                  name="volume"
                  value={formData.volume}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                >
                  <option value="">请选择册别</option>
                  {volumes.map(volume => (
                    <option key={volume.id} value={volume.id}>
                      {volume.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                课程内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="请输入课程内容大纲..."
                rows={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    生成中...
                  </>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    生成课件
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg"
              >
                重置
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg mb-8">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700 mr-3"></div>
              <div>
                <p className="font-medium">正在生成课件，请稍候...</p>
                <p className="text-sm">清华大学AI正在为您精心制作课件内容</p>
              </div>
            </div>
          </div>
        )}

        {result && result.success && result.data && (
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-green-600 flex items-center">
                <span className="mr-3">✅</span>
                课件生成成功
              </h3>
              <div className="text-right">
                <p className="text-sm text-gray-500">{result.data.university}</p>
                <p className="text-xs text-purple-600">{result.data.motto}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                <span className="mr-2">📋</span>
                课件信息
              </h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">学科:</span>
                    <p className="font-medium">{subjects.find(s => s.id === result.data!.subject)?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">年级:</span>
                    <p className="font-medium">{grades.find(g => g.id === result.data!.grade)?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">册别:</span>
                    <p className="font-medium">{volumes.find(v => v.id === result.data!.volume)?.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">生成时间:</span>
                    <p className="font-medium">{new Date(result.data.createdAt).toLocaleString('zh-CN')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="mr-2">📖</span>
                  课程概述
                </h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  {result.data.content.overview}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">🧠</span>
                    核心概念
                  </h4>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {result.data.content.concepts.map((concept, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">📐</span>
                    重要公式
                  </h4>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {result.data.content.formulas.map((formula, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></span>
                          {formula}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">📊</span>
                    图表说明
                  </h4>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {result.data.content.diagrams.map((diagram, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                          {diagram}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                    <span className="mr-2">📚</span>
                    练习题目
                  </h4>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <ol className="space-y-2">
                      {result.data.content.exercises.map((exercise, index) => (
                        <li key={index} className="flex items-start">
                          <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          {exercise}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg flex items-center">
                <span className="mr-2">📄</span>
                下载PPT
              </button>
              <button className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg flex items-center">
                <span className="mr-2">📑</span>
                导出PDF
              </button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg flex items-center">
                <span className="mr-2">☁️</span>
                保存到云端
              </button>
              <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg flex items-center">
                <span className="mr-2">📧</span>
                分享课件
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TsinghuaCoursewareGenerator