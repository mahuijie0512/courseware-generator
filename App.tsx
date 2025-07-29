import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">高中课件生成器</h1>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">欢迎使用课件生成器</h2>
          <p className="text-gray-600">
            这是一个智能的高中课件生成系统，支持数学、物理、化学、生物等学科的课件自动生成。
          </p>
          <div className="mt-6">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              开始生成课件
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App