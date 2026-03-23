# InTouract's Daily Logger 需求文档

## 1. 应用概述

### 1.1 应用名称
InTouract's Daily Logger

### 1.2 应用描述
一个生产级内部工作更新与入职管理系统，支持员工日志提交、多级审批流程、角色权限管理、CEO管理面板等功能，可部署在Replit平台。

### 1.3 技术栈
- 前端：Next.js (App Router) + TypeScript + Tailwind CSS
- 后端：Next.js API Routes\n- 数据库：Prisma ORM + PostgreSQL (Supabase)
- 认证：Email/Password + bcrypt + JWT (HttpOnly Cookie)
- 部署：Replit Deploy
- 其他：Zod (表单验证)、date-fns (日期处理)\n
## 2. 核心功能\n
### 2.1 用户认证系统
- 用户注册：邮箱、密码、姓名、电话、申请角色、职位
- 用户登录：邮箱密码验证，仅激活用户可登录
- 登出功能：清除认证Cookie
- 密码加密：使用bcrypt加密存储
- 会话管理：JWT存储在HttpOnly Cookie中

### 2.2 角色与权限管理
- 三种角色：CEO、Admin、Employee
- 用户状态：PENDING（待审批）、ACTIVE（已激活）、REJECTED（已拒绝）
- 审批流程：\n  - Admin申请需CEO审批
  - Employee申请需Admin或CEO审批
  - 审批后设置systemRole并激活账户
- 初始CEO账户：\n  - 邮箱：intouract.22@gmail.com
  - 密码：InTouract@1438
  - 通过seed脚本创建，状态为ACTIVE

### 2.3 日志管理系统
- 员工日志提交：标题、描述、状态（进行中/已完成/已阻塞）、链接列表
- 日志查看：用户查看自己的日志历史
- 日志编辑/删除：仅限本人操作
- Admin查看：可查看所有员工日志，支持日期和状态筛选
- CEO查看：可查看所有日志\n- 软删除机制：删除标记为deleted=true\n
### 2.4 CEO管理面板
- 审批管理：查看并处理待审批的Admin和Employee申请
- 日志管理：提交和查看自己的工作日志
- 学院管理（Colleges）：CRUD操作，包含名称、状态、入职状态
- 公司管理（Companies）：CRUD操作，包含名称、状态、入职状态
- 综合面板：\n  - 学院/公司数量统计（按状态分类）
  - 今日提交率（已提交用户/总激活用户）
  - 未提交用户列表（最近N天未提交日志的用户）
\n### 2.5 Admin管理面板
- 审批管理：查看并处理待审批的Employee申请
- 团队日志：查看所有员工日志，支持日期和状态筛选\n- 个人日志：提交和管理自己的工作日志
\n### 2.6 Employee面板
- 个人资料：查看个人信息
- 日志管理：提交、查看、编辑、删除自己的工作日志
\n## 3. 数据库设计

### 3.1 数据模型
- User：用户表（id、email、password、name、phone、requestedRole、systemRole、status、title、approvedAt等）
- DailyLog：日志表（id、userId、title、description、status、links数组、deleted、createdAt等）
- College：学院表（id、name、status、onboardStatus、createdAt等）\n- Company：公司表（id、name、status、onboardStatus、createdAt等）\n\n### 3.2 枚举类型
- Role：CEO、ADMIN、EMPLOYEE
- Status：PENDING、ACTIVE、REJECTED
- LogStatus：IN_PROGRESS、COMPLETED、BLOCKED
- OnboardStatus：NOT_STARTED、IN_PROGRESS、COMPLETED

## 4. API接口

### 4.1 认证接口
- POST /api/auth/register：用户注册
- POST /api/auth/login：用户登录
- POST /api/auth/logout：用户登出
- GET /api/users/me：获取当前用户信息
\n### 4.2 用户管理接口
- GET /api/users/pending：获取待审批用户列表（CEO查看Admin和Employee，Admin仅查看Employee）
- POST /api/users/approve：审批用户（CEO审批Admin，Admin/CEO审批Employee）
- POST /api/users/reject：拒绝用户申请\n\n### 4.3 日志接口
- GET /api/daily-log：获取日志列表（支持筛选）
- POST /api/daily-log：创建日志
- PUT /api/daily-log/[id]：更新日志
- DELETE /api/daily-log/[id]：删除日志（软删除）

### 4.4 学院管理接口（CEO专用）
- GET /api/colleges：获取学院列表
- POST /api/colleges：创建学院
- PUT /api/colleges/[id]：更新学院\n- DELETE /api/colleges/[id]：删除学院

### 4.5 公司管理接口（CEO专用）
- GET /api/companies：获取公司列表
- POST /api/companies：创建公司
- PUT /api/companies/[id]：更新公司
- DELETE /api/companies/[id]：删除公司

### 4.6 仪表盘接口
- GET /api/dashboard/metrics：获取CEO仪表盘数据（学院/公司统计、提交率、未提交用户列表）

## 5. 前端页面\n
### 5.1 公共页面
- / (首页)：未登录显示登录/注册入口，已登录跳转至对应角色仪表盘
- /register：注册页面
- /login：登录页面
\n### 5.2 CEO仪表盘 (/dashboard/ceo)
- 审批面板：待审批Admin和Employee列表
- 日志面板：CEO个人日志提交表单和历史记录
- 学院管理面板：学院列表、CRUD操作、状态筛选
- 公司管理面板：公司列表、CRUD操作、状态筛选\n- 综合概览面板：统计数据和未提交用户列表

### 5.3 Admin仪表盘 (/dashboard/admin)
- 审批面板：待审批Employee列表
- 团队日志面板：所有员工日志，支持日期和状态筛选
- 个人日志面板：Admin自己的日志提交和历史\n
### 5.4 Employee仪表盘 (/dashboard)\n- 个人资料：显示用户信息
- 日志管理：日志提交表单和历史记录表格

### 5.5 共享组件
- Sidebar：角色感知的侧边栏导航
- Topbar：顶部栏，包含用户下拉菜单和登出按钮
- LogForm：日志提交/编辑模态框
- Table：支持服务端分页的表格组件

## 6. 安全与权限

### 6.1 服务端验证
- 所有API路由必须验证JWT和用户角色
- 用户只能操作自己的日志
- CEO专属功能（学院/公司管理）需验证CEO角色
- Admin审批仅限Employee，CEO审批包含Admin

### 6.2 前端安全
- 使用fetch时包含credentials以传递Cookie
- 使用Zod进行表单验证
- 根据权限禁用UI操作按钮
- 显示友好的空状态提示

### 6.3 密码安全
- 使用bcrypt加密密码，SALT_ROUNDS=10
- 首次登录后建议CEO修改密码
- 实现密码修改功能\n
## 7. 部署配置

### 7.1 环境变量
- DATABASE_URL：Supabase PostgreSQL连接字符串
- JWT_SECRET：JWT签名密钥
- CEO_EMAIL：intouract.22@gmail.com
- CEO_PASSWORD：InTouract@1438
- SALT_ROUNDS：10
- NEXT_PUBLIC_APP_NAME：InTouract
- NODE_ENV：production
\n### 7.2 数据库迁移与种子数据
- 使用Prisma Migrate进行数据库迁移
- 种子脚本仅创建CEO账户（从环境变量读取邮箱和密码）\n- 部署后执行命令：npx prisma migrate deploy && ts-node prisma/seed.ts

### 7.3 Replit部署步骤
1. 创建新Repl（导入代码仓库或从生成代码创建）
2. 在Replit Secrets中添加所有环境变量
3. 运行 npm ci 或 pnpm install
4. 运行 npx prisma migrate deploy
5. 运行 ts-node prisma/seed.ts\n6. 启动Repl或点击Deploy，应用将在Repl公共URL上可访问

### 7.4 package.json脚本
- dev：next dev -p 3000
- build：next build
- start：next start -p 3000
- prisma:migrate：prisma migrate deploy
- prisma:seed：ts-node prisma/seed.ts
\n## 8. 数据约束

### 8.1 种子数据
- 仅包含一个CEO账户（邮箱：intouract.22@gmail.com，密码：InTouract@1438）
- 不包含任何模拟用户或示例日志
- CEO账户状态为ACTIVE，systemRole为CEO

### 8.2 数据持久化
- 所有数据必须通过数据库持久化
- 禁止使用内存中的模拟数据
\n### 8.3 功能限制
- 不包含任务分配功能
- Admin晋升必须由CEO完成
- Employee激活必须由Admin完成

## 9. 测试要求

### 9.1 单元测试\n- 认证流程测试：注册 → CEO审批 → Admin审批Employee
\n### 9.2 集成测试
- Employee创建日志 → CEO查看日志\n\n## 10. 设计风格

- 配色方案：采用专业的企业级配色，主色调为深蓝色（#1E40AF），辅助色为浅灰色（#F3F4F6）和白色，强调色为绿色（#10B981）用于成功状态
- 布局方式：采用侧边栏+主内容区的经典后台布局，侧边栏固定，主内容区可滚动
- 视觉细节：使用中等圆角（8px），卡片式设计带有轻微阴影，按钮采用实心填充样式，表格使用斑马纹提升可读性
- 交互反馈：按钮hover状态有颜色加深效果，表单验证错误显示红色提示，操作成功显示绿色Toast提示