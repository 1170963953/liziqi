'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Result } from '@/types/supabase';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch('/api/results');
      const data = await response.json();

      if (response.ok) {
        setResults(data.results || []);
      } else {
        setError(data.error || '获取数据失败');
      }
    } catch (err) {
      setError('网络错误，请重试');
    } finally {
      setLoading(false);
    }
  };

  // 格式化金额显示
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        {/* 返回按钮 */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回主页
        </Link>

        {/* 页面标题 */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">计算结果</h1>

        {/* 加载状态 */}
        {loading && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* 空状态 */}
        {!loading && !error && results.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">暂无计算结果</h2>
            <p className="text-gray-500 mb-6">请先上传数据并执行计算</p>
            <Link
              href="/upload"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              前往上传数据
            </Link>
          </div>
        )}

        {/* 结果表格 */}
        {!loading && !error && results.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">序号</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">员工姓名</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">月平均工资</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">缴费基数</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">公司缴纳金额</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {results.map((result, index) => (
                    <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{result.employee_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">
                        ¥{formatAmount(result.avg_salary)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">
                        ¥{formatAmount(result.contribution_base)}
                      </td>
                      <td className="px-6 py-4 text-sm text-green-600 text-right font-mono font-semibold">
                        ¥{formatAmount(result.company_fee)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* 汇总行 */}
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-gray-700">
                      合计 ({results.length} 位员工)
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">—</td>
                    <td className="px-6 py-4 text-sm text-gray-900 text-right font-mono">—</td>
                    <td className="px-6 py-4 text-sm text-green-600 text-right font-mono font-bold">
                      ¥{formatAmount(results.reduce((sum, r) => sum + r.company_fee, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* 统计信息 */}
        {!loading && !error && results.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">员工人数</p>
              <p className="text-2xl font-bold text-gray-900">{results.length}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">平均缴费基数</p>
              <p className="text-2xl font-bold text-gray-900">
                ¥{formatAmount(results.reduce((sum, r) => sum + r.contribution_base, 0) / results.length)}
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-sm text-gray-600">公司月均缴纳</p>
              <p className="text-2xl font-bold text-green-600">
                ¥{formatAmount(results.reduce((sum, r) => sum + r.company_fee, 0))}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
