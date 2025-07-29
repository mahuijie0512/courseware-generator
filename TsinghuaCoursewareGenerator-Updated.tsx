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
    subject: 'physics', // 默认物理
    grade: 'grade1',    // 默认高一
    volume: 'volume1',  // 默认上册
    title: '运动的描述 - 质点与参考系' // 默认标题
  })
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<GenerateResponse | null>(null)
  const [error, setError] = useState<string>('')
  const [showForm, setShowForm] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showCourseware, setShowCourseware] = useState(false)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + Math.random() * 15
      })
    }, 200)
    return interval
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.grade || !formData.volume || !formData.title) {
      setError('请填写所有必填字段')
      return
    }

    setLoading(true)
    setShowProgress(true)
    setError('')
    setResult(null)

    // 开始进度条动画
    const progressInterval = simulateProgress()

    try {
      const response = await axios.post<GenerateResponse>('/api/generate', formData)
      
      // 等待进度条完成
      setTimeout(() => {
        clearInterval(progressInterval)
        setProgress(100)
        setResult(response.data)
        setLoading(false)
        
        // 再等待一秒后显示课件
        setTimeout(() => {
          setShowProgress(false)
          setShowCourseware(true)
        }, 1000)
      }, 3000) // 模拟3秒生成时间
      
    } catch (err) {
      clearInterval(progressInterval)
      setError('生成课件失败，请稍后重试')
      setLoading(false)
      setShowProgress(false)
      console.error('生成错误:', err)
    }
  }

  const resetForm = () => {
    setFormData({
      subject: 'physics',
      grade: 'grade1',
      volume: 'volume1',
      title: '运动的描述 - 质点与参考系'
    })
    setResult(null)
    setError('')
    setShowForm(false)
    setShowProgress(false)
    setShowCourseware(false)
    setProgress(0)
  }

  const startGeneration = () => {
    setShowForm(true)
  }

  // 进度条页面
  if (showProgress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <div className="text-purple-800 font-bold text-3xl">清华</div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">正在生成课件</h2>
            <p className="text-purple-200">清华大学AI正在为您精心制作课件内容...</p>
          </div>
          
          {/* 进度条 */}
          <div className="w-96 mx-auto">
            <div className="bg-white bg-opacity-20 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-4 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-white text-lg font-medium">{Math.round(progress)}%</p>
          </div>
          
          {/* 生成步骤提示 */}
          <div className="mt-8 space-y-2">
            <div className={`flex items-center justify-center text-white ${progress > 20 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <span>分析课程内容...</span>
            </div>
            <div className={`flex items-center justify-center text-white ${progress > 50 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <span>生成教学大纲...</span>
            </div>
            <div className={`flex items-center justify-center text-white ${progress > 80 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
              <span>制作可视化内容...</span>
            </div>
            <div className={`flex items-center justify-center text-white ${progress >= 100 ? 'opacity-100' : 'opacity-50'}`}>
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <span>课件生成完成！</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 课件展示页面
  if (showCourseware) {
    return (
      <div className="min-h-screen">
        {/* 顶部导航栏 */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 shadow-lg">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <span className="text-purple-600 font-bold text-sm">清华</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">智能课件生成系统</h1>
                <p className="text-purple-200 text-sm">课件生成成功</p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all"
            >
              返回首页
            </button>
          </div>
        </div>

        {/* 嵌入physics-courseware-visual.html的内容 */}
        <div style={{
          fontFamily: "'Microsoft YaHei', Arial, sans-serif",
          lineHeight: 1.6,
          color: '#333',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          minHeight: 'calc(100vh - 80px)',
          padding: '20px'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            background: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '15px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
            overflow: 'hidden'
          }}>
            {/* 课件头部 */}
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: 'linear-gradient(45deg, #4CAF50, #45a049)',
              color: 'white'
            }}>
              <h1 style={{
                fontSize: '2.5em',
                margin: '0 0 10px 0',
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
              }}>🎓 运动的描述</h1>
              <p style={{
                fontSize: '1.2em',
                opacity: 0.9,
                margin: 0
              }}>质点与参考系 | 高一物理 | 必修第一册</p>
            </div>

            {/* 课件内容 */}
            <div style={{ padding: '30px' }}>
              {/* 学习目标 */}
              <div style={{
                margin: '30px 0',
                padding: '25px',
                background: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: '5px solid #4CAF50'
              }}>
                <h2 style={{
                  color: '#2c3e50',
                  fontSize: '1.8em',
                  margin: '0 0 20px 0',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  📚 学习目标
                </h2>
                <div>
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    <li style={{ padding: '8px 0', position: 'relative', paddingLeft: '30px' }}>
                      <span style={{
                        content: '✓',
                        position: 'absolute',
                        left: 0,
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>✓</span>
                      理解机械运动的概念和特点
                    </li>
                    <li style={{ padding: '8px 0', position: 'relative', paddingLeft: '30px' }}>
                      <span style={{
                        content: '✓',
                        position: 'absolute',
                        left: 0,
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>✓</span>
                      掌握质点模型的建立和应用条件
                    </li>
                    <li style={{ padding: '8px 0', position: 'relative', paddingLeft: '30px' }}>
                      <span style={{
                        content: '✓',
                        position: 'absolute',
                        left: 0,
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>✓</span>
                      理解参考系的概念和运动的相对性
                    </li>
                    <li style={{ padding: '8px 0', position: 'relative', paddingLeft: '30px' }}>
                      <span style={{
                        content: '✓',
                        position: 'absolute',
                        left: 0,
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>✓</span>
                      培养建立物理模型的科学思维方法
                    </li>
                  </ul>
                </div>
              </div>

              {/* 核心概念 */}
              <div style={{
                margin: '30px 0',
                padding: '25px',
                background: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: '5px solid #4CAF50'
              }}>
                <h2 style={{
                  color: '#2c3e50',
                  fontSize: '1.8em',
                  margin: '0 0 20px 0'
                }}>📚 核心概念</h2>
                
                {/* 机械运动 */}
                <div style={{
                  background: '#e3f2fd',
                  padding: '20px',
                  borderRadius: '8px',
                  margin: '15px 0',
                  borderLeft: '4px solid #2196F3'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#1976D2',
                    fontSize: '1.3em',
                    marginBottom: '10px'
                  }}>1. 机械运动 (Mechanical Motion)</div>
                  <p><strong>定义：</strong>物体的空间位置随时间的变化</p>
                  <p><strong>特点：</strong>自然界中最简单、最基本的运动形态</p>
                  <div style={{
                    background: '#fff3e0',
                    padding: '20px',
                    borderRadius: '8px',
                    margin: '15px 0',
                    borderLeft: '4px solid #FF9800'
                  }}>
                    <strong>生活实例：</strong>
                    <ul>
                      <li>🚗 汽车在公路上行驶</li>
                      <li>🚢 巨轮在海上航行</li>
                      <li>✈️ 飞机在天空中飞行</li>
                      <li>🌍 地球的自转和公转</li>
                    </ul>
                  </div>
                </div>

                {/* 质点 */}
                <div style={{
                  background: '#e3f2fd',
                  padding: '20px',
                  borderRadius: '8px',
                  margin: '15px 0',
                  borderLeft: '4px solid #2196F3'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#1976D2',
                    fontSize: '1.3em',
                    marginBottom: '10px'
                  }}>2. 质点 (Mass Point)</div>
                  <p><strong>定义：</strong>忽略物体的大小和形状，把它简化为一个具有质量的点</p>
                  <p><strong>本质：</strong>理想化的物理模型</p>
                </div>

                {/* 参考系 */}
                <div style={{
                  background: '#e3f2fd',
                  padding: '20px',
                  borderRadius: '8px',
                  margin: '15px 0',
                  borderLeft: '4px solid #2196F3'
                }}>
                  <div style={{
                    fontWeight: 'bold',
                    color: '#1976D2',
                    fontSize: '1.3em',
                    marginBottom: '10px'
                  }}>3. 参考系 (Reference Frame)</div>
                  <p><strong>定义：</strong>用来作为参考的物体</p>
                  <p><strong>重要性质：</strong>运动具有相对性</p>
                </div>
              </div>

              {/* 示意图展示 */}
              <div style={{
                margin: '30px 0',
                padding: '25px',
                background: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: '5px solid #4CAF50'
              }}>
                <h2 style={{
                  color: '#2c3e50',
                  fontSize: '1.8em',
                  margin: '0 0 20px 0'
                }}>📊 概念示意图</h2>
                
                {/* 质点模型示意图 */}
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  margin: '20px 0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  textAlign: 'center'
                }}>
                  <h4 style={{ marginBottom: '15px' }}>质点模型转换过程</h4>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '20px'
                  }}>
                    <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                      <div style={{
                        width: '80px',
                        height: '50px',
                        background: '#FFB74D',
                        border: '2px solid #F57C00',
                        borderRadius: '5px',
                        margin: '0 auto 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px'
                      }}>🚗</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>实际物体</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>复杂形状</div>
                    </div>
                    
                    <div style={{ fontSize: '24px', color: '#4CAF50' }}>→</div>
                    
                    <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: '#4CAF50',
                        borderRadius: '50%',
                        margin: '15px auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}></div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>质点模型</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>简化为点</div>
                    </div>
                    
                    <div style={{ fontSize: '24px', color: '#4CAF50' }}>→</div>
                    
                    <div style={{ textAlign: 'center', flex: '1', minWidth: '150px' }}>
                      <div style={{
                        width: '60px',
                        height: '40px',
                        background: '#E3F2FD',
                        border: '2px solid #2196F3',
                        borderRadius: '5px',
                        margin: '5px auto 10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px'
                      }}>📏</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>应用条件</div>
                      <div style={{ fontSize: '12px', color: '#666' }}>大小 &lt;&lt; 研究范围</div>
                    </div>
                  </div>
                </div>

                {/* 运动相对性示意图 */}
                <div style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '10px',
                  margin: '20px 0',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                }}>
                  <h4 style={{ textAlign: 'center', marginBottom: '20px' }}>运动相对性对比</h4>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '20px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      flex: '1',
                      minWidth: '250px',
                      background: '#E8F5E8',
                      padding: '15px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <h5 style={{ color: '#2E7D32', marginBottom: '10px' }}>以地面为参考系</h5>
                      <div style={{ fontSize: '24px', margin: '10px 0' }}>🏠🚂💨</div>
                      <div style={{ fontSize: '14px' }}>
                        <div>🏠 地面：静止</div>
                        <div>🚂 火车：运动</div>
                        <div>👤 乘客：运动</div>
                      </div>
                    </div>
                    
                    <div style={{
                      flex: '1',
                      minWidth: '250px',
                      background: '#E3F2FD',
                      padding: '15px',
                      borderRadius: '8px',
                      textAlign: 'center'
                    }}>
                      <h5 style={{ color: '#1976D2', marginBottom: '10px' }}>以火车为参考系</h5>
                      <div style={{ fontSize: '24px', margin: '10px 0' }}>🏠💨🚂👤</div>
                      <div style={{ fontSize: '14px' }}>
                        <div>🏠 地面：运动</div>
                        <div>🚂 火车：静止</div>
                        <div>👤 乘客：静止</div>
                      </div>
                    </div>
                  </div>
                  <div style={{
                    textAlign: 'center',
                    marginTop: '15px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#E91E63'
                  }}>
                    ⚡ 运动是相对的！
                  </div>
                </div>
              </div>

              {/* 易混点测试 */}
              <div style={{
                margin: '30px 0',
                padding: '25px',
                background: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: '5px solid #FF9800'
              }}>
                <h2 style={{
                  color: '#2c3e50',
                  fontSize: '1.8em',
                  margin: '0 0 20px 0'
                }}>⚠️ 易混点辨析</h2>
                
                <div style={{
                  background: '#FFF3E0',
                  padding: '20px',
                  borderRadius: '8px',
                  margin: '15px 0',
                  borderLeft: '4px solid #FF9800'
                }}>
                  <h4 style={{ color: '#F57C00', marginBottom: '15px' }}>🔍 常见误区</h4>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      background: '#FFEBEE',
                      padding: '15px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      borderLeft: '3px solid #F44336'
                    }}>
                      <strong style={{ color: '#D32F2F' }}>❌ 错误认识：</strong>
                      <p style={{ margin: '5px 0' }}>质点就是很小的物体</p>
                    </div>
                    <div style={{
                      background: '#E8F5E8',
                      padding: '15px',
                      borderRadius: '5px',
                      borderLeft: '3px solid #4CAF50'
                    }}>
                      <strong style={{ color: '#388E3C' }}>✅ 正确理解：</strong>
                      <p style={{ margin: '5px 0' }}>质点是理想化模型，与物体实际大小无关，关键看研究问题的需要</p>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <div style={{
                      background: '#FFEBEE',
                      padding: '15px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      borderLeft: '3px solid #F44336'
                    }}>
                      <strong style={{ color: '#D32F2F' }}>❌ 错误认识：</strong>
                      <p style={{ margin: '5px 0' }}>运动是绝对的，静止是相对的</p>
                    </div>
                    <div style={{
                      background: '#E8F5E8',
                      padding: '15px',
                      borderRadius: '5px',
                      borderLeft: '3px solid #4CAF50'
                    }}>
                      <strong style={{ color: '#388E3C' }}>✅ 正确理解：</strong>
                      <p style={{ margin: '5px 0' }}>运动和静止都是相对的，都需要选择参考系来描述</p>
                    </div>
                  </div>

                  <div>
                    <div style={{
                      background: '#FFEBEE',
                      padding: '15px',
                      borderRadius: '5px',
                      marginBottom: '10px',
                      borderLeft: '3px solid #F44336'
                    }}>
                      <strong style={{ color: '#D32F2F' }}>❌ 错误认识：</strong>
                      <p style={{ margin: '5px 0' }}>参考系只能选择静止的物体</p>
                    </div>
                    <div style={{
                      background: '#E8F5E8',
                      padding: '15px',
                      borderRadius: '5px',
                      borderLeft: '3px solid #4CAF50'
                    }}>
                      <strong style={{ color: '#388E3C' }}>✅ 正确理解：</strong>
                      <p style={{ margin: '5px 0' }}>参考系可以任意选择，运动的物体也可以作为参考系</p>
                    </div>
                  </div>
                </div>

                {/* 自测题 */}
                <div style={{
                  background: '#E1F5FE',
                  padding: '20px',
                  borderRadius: '8px',
                  margin: '15px 0'
                }}>
                  <h4 style={{ color: '#0277BD', marginBottom: '15px' }}>🧪 快速自测</h4>
                  
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>1. 下列关于质点的说法正确的是：</p>
                    <div style={{ paddingLeft: '20px', fontSize: '14px' }}>
                      <p>A. 质点是很小很小的物体</p>
                      <p>B. 只有小物体才能看作质点</p>
                      <p>C. 质点是忽略大小和形状的理想化模型</p>
                      <p>D. 质点就是几何中的点</p>
                    </div>
                    <details style={{ marginTop: '10px', fontSize: '14px' }}>
                      <summary style={{ color: '#0277BD', cursor: 'pointer' }}>点击查看答案</summary>
                      <div style={{ 
                        background: '#C8E6C9', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        marginTop: '5px' 
                      }}>
                        <strong>答案：C</strong><br/>
                        解析：质点是物理学中的理想化模型，不是实际存在的物体，与物体的实际大小无关。
                      </div>
                    </details>
                  </div>

                  <div>
                    <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>2. 坐在行驶列车中的乘客看到车外的树木向后退，这是以什么为参考系？</p>
                    <div style={{ paddingLeft: '20px', fontSize: '14px' }}>
                      <p>A. 地面</p>
                      <p>B. 列车</p>
                      <p>C. 树木</p>
                      <p>D. 乘客自己</p>
                    </div>
                    <details style={{ marginTop: '10px', fontSize: '14px' }}>
                      <summary style={{ color: '#0277BD', cursor: 'pointer' }}>点击查看答案</summary>
                      <div style={{ 
                        background: '#C8E6C9', 
                        padding: '10px', 
                        borderRadius: '5px', 
                        marginTop: '5px' 
                      }}>
                        <strong>答案：B</strong><br/>
                        解析：乘客看到树木向后退，说明是以列车（或乘客）为参考系观察的结果。
                      </div>
                    </details>
                  </div>
                </div>
              </div>

              {/* 历史名人简介 */}
              <div style={{
                margin: '30px 0',
                padding: '25px',
                background: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: '5px solid #9C27B0'
              }}>
                <h2 style={{
                  color: '#2c3e50',
                  fontSize: '1.8em',
                  margin: '0 0 20px 0'
                }}>👨‍🔬 物理学史话</h2>
                
                {/* 亚里士多德 */}
                <div style={{
                  background: '#F3E5F5',
                  padding: '20px',
                  borderRadius: '8px',
                  margin: '15px 0',
                  borderLeft: '4px solid #9C27B0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(45deg, #9C27B0, #E1BEE7)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      flexShrink: 0
                    }}>🏛️</div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h4 style={{ color: '#7B1FA2', marginBottom: '10px' }}>
                        亚里士多德 (Aristotle, 前384-前322)
                      </h4>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '10px' }}>
                        古希腊杰出的哲学家、科学家，形式逻辑学的创始人。他首次给出了时间的定义，
                        认为既然运动是永恒的，那么时间也同样是永恒的。
                      </p>
                      <div style={{
                        background: '#E8EAF6',
                        padding: '10px',
                        borderRadius: '5px',
                        fontStyle: 'italic',
                        color: '#3F51B5'
                      }}>
                        💬 名言："不了解运动，就不了解自然。"
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                        📍 贡献：建立了早期的运动理论，为后世物理学发展奠定了哲学基础
                      </div>
                    </div>
                  </div>
                </div>

                {/* 伽利略 */}
                <div style={{
                  background: '#F3E5F5',
                  padding: '20px',
                  borderRadius: '8px',
                  margin: '15px 0',
                  borderLeft: '4px solid #9C27B0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(45deg, #FF9800, #FFE0B2)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      flexShrink: 0
                    }}>🔭</div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h4 style={{ color: '#7B1FA2', marginBottom: '10px' }}>
                        伽利略·伽利雷 (Galileo Galilei, 1564-1642)
                      </h4>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '10px' }}>
                        意大利物理学家、天文学家，近代实验科学的奠基人。他建立了相对性原理的基础，
                        提出了惯性概念，为牛顿力学的建立铺平了道路。
                      </p>
                      <div style={{
                        background: '#E8EAF6',
                        padding: '10px',
                        borderRadius: '5px',
                        fontStyle: 'italic',
                        color: '#3F51B5'
                      }}>
                        💬 相对性原理："在任何惯性参考系中，力学规律都是相同的。"
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                        📍 贡献：建立了相对性原理，发现了惯性定律，开创了实验物理学
                      </div>
                    </div>
                  </div>
                </div>

                {/* 牛顿 */}
                <div style={{
                  background: '#F3E5F5',
                  padding: '20px',
                  borderRadius: '8px',
                  margin: '15px 0',
                  borderLeft: '4px solid #9C27B0'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(45deg, #4CAF50, #C8E6C9)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '30px',
                      flexShrink: 0
                    }}>🍎</div>
                    <div style={{ flex: 1, minWidth: '250px' }}>
                      <h4 style={{ color: '#7B1FA2', marginBottom: '10px' }}>
                        艾萨克·牛顿 (Isaac Newton, 1643-1727)
                      </h4>
                      <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '10px' }}>
                        英国物理学家、数学家，经典力学的集大成者。他在质点模型的基础上建立了
                        完整的经典力学体系，统一了地面和天体的运动规律。
                      </p>
                      <div style={{
                        background: '#E8EAF6',
                        padding: '10px',
                        borderRadius: '5px',
                        fontStyle: 'italic',
                        color: '#3F51B5'
                      }}>
                        💬 名言："如果我看得更远，那是因为我站在巨人的肩膀上。"
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                        📍 贡献：建立牛顿三定律和万有引力定律，创立了经典力学体系
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 重点公式 */}
              <div style={{
                margin: '30px 0',
                padding: '25px',
                background: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: '5px solid #4CAF50'
              }}>
                <h2 style={{
                  color: '#2c3e50',
                  fontSize: '1.8em',
                  margin: '0 0 20px 0'
                }}>📚 重点公式与关系</h2>
                <div style={{
                  background: '#f5f5f5',
                  padding: '15px',
                  borderRadius: '5px',
                  fontFamily: "'Courier New', monospace",
                  textAlign: 'center',
                  fontSize: '1.2em',
                  margin: '15px 0',
                  border: '2px dashed #666'
                }}>
                  物体能否看作质点 = f(研究问题的需要)
                </div>
                <div style={{
                  background: '#f5f5f5',
                  padding: '15px',
                  borderRadius: '5px',
                  fontFamily: "'Courier New', monospace",
                  textAlign: 'center',
                  fontSize: '1.2em',
                  margin: '15px 0',
                  border: '2px dashed #666'
                }}>
                  运动描述 = 物体位置变化 + 参考系选择
                </div>
              </div>

              {/* 课堂小结 */}
              <div style={{
                margin: '30px 0',
                padding: '25px',
                background: '#f8f9fa',
                borderRadius: '10px',
                borderLeft: '5px solid #4CAF50'
              }}>
                <h2 style={{
                  color: '#2c3e50',
                  fontSize: '1.8em',
                  margin: '0 0 20px 0'
                }}>📚 课堂小结</h2>
                <div>
                  <h4>本节课核心内容：</h4>
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    <li style={{ padding: '8px 0', position: 'relative', paddingLeft: '30px' }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>✓</span>
                      建立了<span style={{
                        background: '#ffeb3b',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: 'bold'
                      }}>质点模型</span>这一重要的理想化模型
                    </li>
                    <li style={{ padding: '8px 0', position: 'relative', paddingLeft: '30px' }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>✓</span>
                      理解了<span style={{
                        background: '#ffeb3b',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: 'bold'
                      }}>运动的相对性</span>和参考系的重要性
                    </li>
                    <li style={{ padding: '8px 0', position: 'relative', paddingLeft: '30px' }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>✓</span>
                      掌握了<span style={{
                        background: '#ffeb3b',
                        padding: '2px 6px',
                        borderRadius: '3px',
                        fontWeight: 'bold'
                      }}>科学抽象</span>的研究方法
                    </li>
                    <li style={{ padding: '8px 0', position: 'relative', paddingLeft: '30px' }}>
                      <span style={{
                        position: 'absolute',
                        left: 0,
                        color: '#4CAF50',
                        fontWeight: 'bold',
                        fontSize: '1.2em'
                      }}>✓</span>
                      为后续学习位移、速度等概念打下基础
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 页脚 */}
            <div style={{
              background: '#2c3e50',
              color: 'white',
              textAlign: 'center',
              padding: '20px'
            }}>
              <p>📚 课件来源：基于人教版高中物理必修第一册第15-19页内容制作</p>
              <p>🎯 制作时间：2025年7月29日 | 适用对象：高一学生</p>
              <p>💡 重点突出，简明扼要，一看就明白！</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 首页
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

  // 表单页面
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
                课程标题 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="请输入课程标题..."
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
                <span className="mr-2">✨</span>
                生成课件
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
      </div>
    </div>
  )
}

export default TsinghuaCoursewareGenerator