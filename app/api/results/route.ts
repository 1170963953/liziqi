import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getAvailableYears } from '@/lib/calculate';

export async function GET(request: NextRequest) {
  try {
    // 获取计算结果
    const { data: results, error } = await supabase
      .from('results')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // 获取可用年份
    const years = await getAvailableYears();

    return NextResponse.json({ results, years });
  } catch (error) {
    console.error('获取结果错误:', error);
    return NextResponse.json({ error: '获取结果失败' }, { status: 500 });
  }
}
