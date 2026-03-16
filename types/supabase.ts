// Supabase 数据库类型定义

export interface City {
  id: number;
  city_name: string;
  year: string;
  base_min: number;
  base_max: number;
  rate: number;
}

export interface Salary {
  id: number;
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
}

export interface Result {
  id: number;
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
}

// Excel 导入的原始数据类型（处理 city_namte 拼写错误）
export interface CityExcelRow {
  id?: number;
  city_namte: string; // 注意：原Excel文件中是 city_namte
  year: string;
  rate: number;
  base_min: number;
  base_max: number;
}

export interface SalaryExcelRow {
  id?: number;
  employee_id: string;
  employee_name: string;
  month: string;
  salary_amount: number;
}

// 计算结果类型
export interface CalculationResult {
  employee_name: string;
  avg_salary: number;
  contribution_base: number;
  company_fee: number;
}
