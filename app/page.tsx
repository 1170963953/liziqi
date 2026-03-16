import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      {/* 标题 */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">五险一金计算器</h1>
        <p className="text-gray-600">计算公司为员工应缴纳的社保公积金费用</p>
      </div>

      {/* 功能卡片区域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {/* 数据上传卡片 */}
        <Link href="/upload" className="group">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">数据上传</h2>
              <p className="text-gray-600 text-sm">上传城市标准、员工工资数据并执行计算</p>
            </div>
          </div>
        </Link>

        {/* 结果查询卡片 */}
        <Link href="/results" className="group">
          <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-green-500">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">结果查询</h2>
              <p className="text-gray-600 text-sm">查看员工社保公积金计算结果</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 页脚说明 */}
      <div className="mt-16 text-center text-gray-500 text-sm">
        <p>使用 Next.js + Tailwind CSS + Supabase 构建</p>
      </div>
    </div>
  );
}
