import React, { useState } from 'react'
import axios from 'axios'

interface Subject {
  id: string
  name: string
}

interface Grade {
  id: string
  name: string
}

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
  }
}

const CoursewareGenerator: React.FC = () => {
  const [subjects] = useState<Subject[]>([
    { id: 'math', name: '数学' },
    { id: 'physics', name: '物理' },
    { id: 'chemistry', name: '化学' },
    { id: 'biology', name: '生物' }
  ])

  const [grades] = useState<Grade[]>([
    { id: 'grade1', name: '高一' },
    { id: 'grade2', name: '高二' },
    { id: 'grade3', name: '高三' }
  ])

  const [formData, setFormData] = useState<GenerateRequest>({
    subject: '',
    grade: '',
    volume: '',
    title: ''
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [showForm, setShowForm] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.grade || !formData.volume || !formData.title) {
      alert('请填写所有必填字段')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await axios.post<GenerateResponse>('/api/generate', formData)
      setResult(response.data)
    } catch (error) {
      console.error('生成课件失败:', error)
      setResult({
        success: false,
        message: '生成课件失败，请稍后重试'
      })
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
    setShowForm(false)
  }

  if (!showForm) {
    return (
      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-600 text-white p-4">
          <h1 className="text-2xl font-bold">高中课件生成器</h1>
        </header>
        <main className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">欢迎使用课件生成器</h2>
            <p className="text-gray-600 mb-6">
              这是一个智能的高中课件生成系统，支持数学、物理、化学、生物等学科的课件自动生成。
            </p>
            <button 
              onClick={() => setShowForm(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
            >
              开始生成课件
            </button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">高中课件生成器</h1>
          <button 
            onClick={resetForm}
            className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded"
          >
            返回首页
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 表单区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">课件生成设置</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  学科 <span className="text-red-500">*</span>
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">请选择学科</option>
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">请选择册别</option>
                  <option value="上册">上册</option>
                  <option value="下册">下册</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  课程标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="请输入课程标题"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {loading ? '生成中...' : '生成课件'}
              </button>
            </form>
          </div>

          {/* 结果区域 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">生成结果</h2>
            
            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">正在生成课件，请稍候...</span>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {result.success ? (
                  <div>
                    <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
                      <p className="text-green-800">{result.message}</p>
                    </div>
                    
                    {result.data && (
                      <div className="space-y-4">
                        <div className="border-b pb-2">
                          <h3 className="font-semibold text-lg">
                            {subjects.find(s => s.id === result.data!.subject)?.name} - 
                            {grades.find(g => g.id === result.data!.grade)?.name} - 
                            {result.data.volume}
                          </h3>
                          <h4 className="text-blue-600 font-medium">{result.data.title}</h4>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">课程概述</h4>
                          <p className="text-gray-700 bg-gray-50 p-3 rounded">
                            {result.data.content.overview}
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">核心概念</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {result.data.content.concepts.map((concept, index) => (
                              <li key={index} className="text-gray-700">{concept}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">重要公式</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {result.data.content.formulas.map((formula, index) => (
                              <li key={index} className="text-gray-700 font-mono">{formula}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">图表说明</h4>
                          <ul className="list-disc list-inside space-y-1">
                            {result.data.content.diagrams.map((diagram, index) => (
                              <li key={index} className="text-gray-700">{diagram}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">练习题目</h4>
                          <ul className="list-decimal list-inside space-y-1">
                            {result.data.content.exercises.map((exercise, index) => (
                              <li key={index} className="text-gray-700">{exercise}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="text-sm text-gray-500 pt-4 border-t">
                          生成时间: {new Date(result.data.createdAt).toLocaleString('zh-CN')}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4">
                    <p className="text-red-800">{result.message}</p>
                  </div>
                )}
              </div>
            )}

            {!result && !loading && (
              <div className="text-center py-8 text-gray-500">
                <p>请填写左侧表单并点击"生成课件"开始生成</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default CoursewareGenerator