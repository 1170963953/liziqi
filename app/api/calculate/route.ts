import { NextRequest, NextResponse } from 'next/server';
import { calculateContributions, saveCalculationResults } from '@/lib/calculate';

export async function POST(request: NextRequest) {
  try {
    const { year } = await request.json();

    if (!year) {
      return NextResponse.json({ error: '请提供年份参数' }, { status: 400 });
    }

    // 执行计算
    const results = await calculateContributions(year);

    // 保存结果
    await saveCalculationResults(results);

    return NextResponse.json({ count: results.length, results });
  } catch (error) {
    console.error('计算错误:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : '计算失败' }, { status: 500 });
  }
}
