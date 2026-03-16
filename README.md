# 五险一金计算器

一个基于 Next.js + Tailwind CSS + Supabase 构建的五险一金计算器 Web 应用。

## 功能特性

- 📊 上传 Excel 文件导入城市标准和员工工资数据
- 🧮 自动计算公司应缴纳的社保公积金费用
- 📋 清晰展示计算结果
- 🎨 现代化的响应式 UI 设计

## 技术栈

- **前端框架**: Next.js 15 (App Router)
- **样式**: Tailwind CSS
- **数据库**: Supabase
- **Excel 处理**: xlsx
- **语言**: TypeScript

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建一个新项目
2. 在项目设置中获取 `Project URL` 和 `anon public key`
3. 创建数据库表：
   - 在 Supabase 控制台打开 SQL Editor
   - 执行 `supabase-setup.sql` 文件中的 SQL 语句
4. 配置环境变量：

```bash
# 复制示例文件
cp .env.local.example .env.local
```

5. 编辑 `.env.local`，填入你的 Supabase 凭证：

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用说明

### 第一步：上传数据

1. 点击主页的"数据上传"卡片
2. 分别上传两个 Excel 文件：
   - `cities.xlsx` - 城市社保标准数据
   - `salaries.xlsx` - 员工工资数据
3. 选择要计算的年份
4. 点击"执行计算并存储结果"

### 第二步：查看结果

1. 点击主页的"结果查询"卡片
2. 查看计算结果表格

## Excel 文件格式

### cities.xlsx 格式

| id | city_namte | year | rate | base_min | base_max |
|----|------------|------|------|----------|----------|
| 1  | 佛山       | 2024 | 0.14 | 4546     | 26421    |

> 注意：Excel 中的列名是 `city_namte`（拼写错误），系统会自动映射为 `city_name`

### salaries.xlsx 格式

| id | employee_id | employee_name | month  | salary_amount |
|----|-------------|---------------|--------|---------------|
| 1  | 1           | 张三          | 202401 | 30000         |
| 2  | 1           | 张三          | 202402 | 29000         |

## 计算逻辑

1. 按员工分组计算年度月平均工资
2. 根据城市标准的基数上下限确定缴费基数：
   - 低于下限 → 使用下限
   - 高于上限 → 使用上限
   - 区间内 → 使用平均工资
3. 公司缴纳金额 = 缴费基数 × 缴纳比例

## 项目结构

```
├── app/                    # Next.js App Router
│   ├── page.tsx           # 主页（双卡片入口）
│   ├── upload/            # 上传页面
│   ├── results/           # 结果页面
│   └── api/               # API 路由
├── lib/                   # 工具函数
│   ├── supabase.ts        # Supabase 客户端
│   └── calculate.ts       # 计算逻辑
├── types/                 # TypeScript 类型定义
└── supabase-setup.sql     # 数据库初始化脚本
```

## 构建生产版本

```bash
npm run build
npm start
```

## 部署

推荐使用 [Vercel](https://vercel.com) 部署：

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署完成

## 许可证

MIT
