import { supabase } from './supabase';
import { City, Salary, CalculationResult } from '@/types/supabase';

/**
 * 核心计算函数
 * @param year 要计算的年份
 * @returns 计算结果数组
 */
export async function calculateContributions(year: string): Promise<CalculationResult[]> {
  // 1. 从 salaries 表读取所有数据
  const { data: salaries, error: salariesError } = await supabase
    .from('salaries')
    .select('*')
    .order('month', { ascending: true });

  if (salariesError) {
    throw new Error(`获取工资数据失败: ${salariesError.message}`);
  }

  // 2. 按 employee_name 分组计算年度月平均工资
  const salaryMap = new Map<string, number[]>();

  salaries?.forEach((salary: Salary) => {
    const name = salary.employee_name;
    if (!salaryMap.has(name)) {
      salaryMap.set(name, []);
    }
    salaryMap.get(name)!.push(salary.salary_amount);
  });

  // 计算每位员工的平均工资
  const avgSalaryMap = new Map<string, number>();
  salaryMap.forEach((salaries, name) => {
    const sum = salaries.reduce((acc, curr) => acc + curr, 0);
    const avg = sum / salaries.length;
    avgSalaryMap.set(name, avg);
  });

  // 3. 从 cities 表获取指定年份的城市标准
  const { data: cities, error: citiesError } = await supabase
    .from('cities')
    .select('*')
    .eq('year', year);

  if (citiesError) {
    throw new Error(`获取城市标准失败: ${citiesError.message}`);
  }

  if (!cities || cities.length === 0) {
    throw new Error(`未找到 ${year} 年的城市标准数据`);
  }

  // 获取城市标准（取第一条，目前只有佛山）
  const cityStandard: City = cities[0];
  const { base_min, base_max, rate } = cityStandard;

  // 4. 计算每位员工的缴费基数和公司缴纳金额
  const results: CalculationResult[] = [];

  avgSalaryMap.forEach((avgSalary, employeeName) => {
    // 确定最终缴费基数
    let contributionBase: number;
    if (avgSalary < base_min) {
      contributionBase = base_min;
    } else if (avgSalary > base_max) {
      contributionBase = base_max;
    } else {
      contributionBase = avgSalary;
    }

    // 5. 计算公司应缴纳金额
    const companyFee = contributionBase * rate;

    results.push({
      employee_name: employeeName,
      avg_salary: Math.round(avgSalary * 100) / 100, // 保留两位小数
      contribution_base: Math.round(contributionBase * 100) / 100,
      company_fee: Math.round(companyFee * 100) / 100,
    });
  });

  return results;
}

/**
 * 将计算结果存储到 results 表
 * @param results 计算结果数组
 */
export async function saveCalculationResults(results: CalculationResult[]): Promise<void> {
  // 清空旧数据
  const { error: deleteError } = await supabase
    .from('results')
    .delete()
    .neq('id', 0); // 删除所有记录

  if (deleteError) {
    throw new Error(`清空旧数据失败: ${deleteError.message}`);
  }

  // 插入新数据
  const { error: insertError } = await supabase
    .from('results')
    .insert(results);

  if (insertError) {
    throw new Error(`保存计算结果失败: ${insertError.message}`);
  }
}

/**
 * 获取可用的年份列表
 * @returns 年份数组
 */
export async function getAvailableYears(): Promise<string[]> {
  const { data, error } = await supabase
    .from('cities')
    .select('year')
    .order('year', { ascending: false });

  if (error) {
    throw new Error(`获取年份列表失败: ${error.message}`);
  }

  // 去重并返回
  const years = [...new Set(data?.map(item => item.year))];
  return years;
}
