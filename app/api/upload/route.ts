import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import * as xlsx from 'xlsx';
import { CityExcelRow, SalaryExcelRow } from '@/types/supabase';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;

    if (!file) {
      return NextResponse.json({ error: '未选择文件' }, { status: 400 });
    }

    if (type !== 'cities' && type !== 'salaries') {
      return NextResponse.json({ error: '无效的文件类型' }, { status: 400 });
    }

    // 读取 Excel 文件
    const arrayBuffer = await file.arrayBuffer();
    const workbook = xlsx.read(arrayBuffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    if (type === 'cities') {
      // 处理城市数据（注意：Excel 中是 city_namte，可能有尾随空格）
      const citiesData = data.map((row: any) => {
        // 智能查找列名（忽略空格）
        const getCellValue = (targetName: string) => {
          const key = Object.keys(row).find(k => k.trim() === targetName);
          return key ? row[key] : undefined;
        };

        return {
          city_name: getCellValue('city_namte'), // 映射 city_namte -> city_name
          year: String(getCellValue('year')),
          base_min: Number(getCellValue('base_min')),
          base_max: Number(getCellValue('base_max')),
          rate: Number(getCellValue('rate')),
        };
      });

      // 插入数据到 cities 表
      const { error } = await supabase.from('cities').insert(citiesData);

      if (error) {
        return NextResponse.json({ error: `插入数据失败: ${error.message}` }, { status: 500 });
      }

      return NextResponse.json({ message: `成功上传 ${citiesData.length} 条城市标准数据` });
    } else {
      // 处理工资数据
      const salariesData = data.map((row: any) => ({
        employee_id: String(row['employee_id']),
        employee_name: String(row['employee_name']),
        month: String(row['month']),
        salary_amount: Number(row['salary_amount']),
      }));

      // 插入数据到 salaries 表
      const { error } = await supabase.from('salaries').insert(salariesData);

      if (error) {
        return NextResponse.json({ error: `插入数据失败: ${error.message}` }, { status: 500 });
      }

      return NextResponse.json({ message: `成功上传 ${salariesData.length} 条工资数据` });
    }
  } catch (error) {
    console.error('上传错误:', error);
    return NextResponse.json({ error: '文件解析失败，请检查文件格式' }, { status: 500 });
  }
}
