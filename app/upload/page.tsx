'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function UploadPage() {
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{
    cities: boolean;
    salaries: boolean;
  }>({ cities: false, salaries: false });

  useEffect(() => {
    // 获取可用年份
    fetch('/api/results')
      .then(res => res.json())
      .then(data => {
        if (data.years) {
          setYears(data.years);
          if (data.years.length > 0) {
            setSelectedYear(data.years[0]);
          }
        }
      })
      .catch(err => console.error('获取年份失败:', err));
  }, []);

  const handleFileUpload = async (fileType: 'cities' | 'salaries', file: File) => {
    setLoading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', fileType);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadProgress(prev => ({ ...prev, [fileType]: true }));
        setMessage({ type: 'success', text: result.message });
        // 重新获取年份列表
        if (fileType === 'cities') {
          const yearsRes = await fetch('/api/results');
          const yearsData = await yearsRes.json();
          if (yearsData.years) {
            setYears(yearsData.years);
            if (yearsData.years.length > 0 && !selectedYear) {
              setSelectedYear(yearsData.years[0]);
            }
          }
        }
      } else {
        setMessage({ type: 'error', text: result.error || '上传失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setLoading(false);
    }
  };

  const handleCalculate = async () => {
    if (!selectedYear) {
      setMessage({ type: 'error', text: '请先选择年份' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: selectedYear }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: `计算成功！已处理 ${result.count} 位员工的数据` });
      } else {
        setMessage({ type: 'error', text: result.error || '计算失败' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '网络错误，请重试' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        {/* 返回按钮 */}
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-8">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          返回主页
        </Link>

        {/* 页面标题 */}
        <h1 className="text-3xl font-bold text-gray-800 mb-8">数据上传与计算</h1>

        {/* 消息提示 */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message.text}
          </div>
        )}

        {/* 上传区域 */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">上传数据文件</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cities 文件上传 */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${uploadProgress.cities ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}>
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">城市标准 (cities.xlsx)</h3>
              <p className="text-sm text-gray-500 mb-4">上传城市社保标准数据</p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('cities', file);
                }}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploadProgress.cities && (
                <p className="mt-2 text-sm text-green-600">✓ 已上传</p>
              )}
            </div>

            {/* Salaries 文件上传 */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${uploadProgress.salaries ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-blue-400'}`}>
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-700 mb-2">员工工资 (salaries.xlsx)</h3>
              <p className="text-sm text-gray-500 mb-4">上传员工每月工资数据</p>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload('salaries', file);
                }}
                disabled={loading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {uploadProgress.salaries && (
                <p className="mt-2 text-sm text-green-600">✓ 已上传</p>
              )}
            </div>
          </div>
        </div>

        {/* 计算区域 */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">执行计算</h2>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">选择年份</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="">-- 请选择年份 --</option>
              {years.map(year => (
                <option key={year} value={year}>{year}年</option>
              ))}
            </select>
          </div>

          <button
            onClick={handleCalculate}
            disabled={loading || !selectedYear}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '处理中...' : '执行计算并存储结果'}
          </button>

          <p className="mt-4 text-sm text-gray-500">
            点击按钮后，系统将根据所选年份的城市标准，计算所有员工的公司应缴纳金额，并将结果存储到数据库。
          </p>
        </div>
      </div>
    </div>
  );
}
