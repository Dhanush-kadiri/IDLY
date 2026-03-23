# 需求文档

## 1. 应用概述

### 1.1 应用名称
InTouract's Daily Logger

### 1.2 应用描述
一个生产级内部工作更新与入职管理系统，支持员工日志提交、多级审批流程、角色权限管理、CEO管理面板等功能，可部署在Replit平台。

## 2. 核心功能

### 2.1 用户认证系统
- 用户注册：邮箱、密码、姓名、电话、申请角色、职位
- Admin注册：邮箱、密码、姓名、电话、职位，申请角色为Admin
- Employee注册：邮箱、密码、姓名、电话、职位，申请角色为Employee，必须选择汇报对象（Reporting To），可选项包括CEO、COO、CTO等高级管理角色
- 用户登录：邮箱密码验证，仅激活用户可登录
- 登出功能：清除认证Cookie
- 密码加密：使用bcrypt加密存储
- 会话管理：JWT存储在HttpOnly Cookie中

### 2.2 角色与权限管理
- 角色类型：CEO、COO、CTO、Admin、Employee
- 用户状态：PENDING（待审批）、ACTIVE（已激活）、REJECTED（已拒绝）
- 审批流程：
  - Admin申请需CEO审批
  - Employee申请需根据其选择的汇报对象（Reporting To）进行审批，审批请求仅发送至被选择的汇报对象
  - 审批后设置systemRole并激活账户
- 权限隔离：
  - 每个高级管理角色（CEO、COO、CTO等）仅能查看和审批选择向其汇报的Employee
  - 未被选择为汇报对象的管理角色无法看到该Employee的审批请求，也无权监控其日志
- 初始CEO账户：
  - 邮箱：intouract.22@gmail.com
  - 密码：InTouract@1438
  - 通过seed脚本创建，状态为ACTIVE

### 2.3 日志管理系统
- 员工日志提交：标题、描述、状态（进行中/已完成/已阻塞）、链接列表
- 日志查看：用户查看自己的日志历史
- 日志编辑/删除：仅限本人操作
- 管理角色查看：每个管理角色（CEO、COO、CTO等）仅能查看向其汇报的Employee的日志，支持日期和状态筛选
- 软删除机制：删除标记为deleted=true

### 2.4 CEO管理面板
- 审批管理：查看并处理待审批的Admin申请，以及选择向CEO汇报的Employee申请
- 日志管理：提交和查看自己的工作日志，以及查看向CEO汇报的Employee日志
- 学院管理（Colleges）：CRUD操作，表单字段包含：
  - Name（名称）
  - Address（地址）
  - SPOC Name（联系人姓名）
  - SPOC Contact（联系人电话）
  - SPOC Mail ID（联系人邮箱）
  - SPOC from InTouract - Name（InTouract侧联系人姓名）
  - SPOC from InTouract - Number（InTouract侧联系人电话）
  - SPOC from InTouract - Mail（InTouract侧联系人邮箱）
  - Duration of the MoU（合作备忘录有效期）
  - Status（状态）
  - Description（描述）
- 公司管理（Companies）：CRUD操作，表单字段包含：
  - Name（名称）
  - Address（地址）
  - SPOC Name（联系人姓名）
  - SPOC Contact（联系人电话）
  - SPOC Mail ID（联系人邮箱）
  - SPOC from InTouract - Name（InTouract侧联系人姓名）
  - SPOC from InTouract - Number（InTouract侧联系人电话）
  - SPOC from InTouract - Mail（InTouract侧联系人邮箱）
  - Duration of the MoU（合作备忘录有效期）
  - Status（状态）
  - Description（描述）
- 综合面板：
  - 学院/公司数量统计（按状态分类）
  - 今日提交率（已提交用户/总激活用户，仅统计向CEO汇报的用户）
  - 未提交用户列表（最近N天未提交日志的用户，仅显示向CEO汇报的用户）

### 2.5 COO/CTO等高级管理角色面板
- 审批管理：查看并处理选择向其汇报的Employee申请
- 团队日志：查看向其汇报的Employee日志，支持日期和状态筛选
- 个人日志：提交和管理自己的工作日志
- 综合面板：
  - 今日提交率（已提交用户/总激活用户，仅统计向该角色汇报的用户）
  - 未提交用户列表（最近N天未提交日志的用户，仅显示向该角色汇报的用户）

### 2.6 Admin管理面板
- 审批管理：查看并处理待审批的Employee申请（仅当Employee选择向Admin汇报时）
- 团队日志：查看向其汇报的Employee日志，支持日期和状态筛选
- 个人日志：提交和管理自己的工作日志

### 2.7 Employee面板
- 个人资料：查看个人信息
- 日志管理：提交、查看、编辑、删除自己的工作日志

## 3. 数据库设计

### 3.1 数据模型
- User：用户表（id、email、password、name、phone、requestedRole、systemRole、status、title、reportingTo、approvedAt等）
  - reportingTo字段：存储Employee选择的汇报对象角色（如CEO、COO、CTO等），仅Employee角色需填写
- DailyLog：日志表（id、userId、title、description、status、links数组、deleted、createdAt等）
- College：学院表（id、name、address、spocName、spocContact、spocMailId、spocInTouractName、spocInTouractNumber、spocInTouractMail、mouDuration、status、description、onboardStatus、createdAt等）
- Company：公司表（id、name、address、spocName、spocContact、spocMailId、spocInTouractName、spocInTouractNumber、spocInTouractMail、mouDuration、status、description、onboardStatus、createdAt等）

### 3.2 枚举类型
- Role：CEO、COO、CTO、ADMIN、EMPLOYEE
- Status：PENDING、ACTIVE、REJECTED
- LogStatus：IN_PROGRESS、COMPLETED、BLOCKED
- OnboardStatus：NOT_STARTED、IN_PROGRESS、COMPLETED
- ReportingTo：CEO、COO、CTO（Employee注册时可选）

## 4. API接口

### 4.1 认证接口
- POST /api/auth/register：用户注册（Employee注册时需包含reportingTo字段）
- POST /api/auth/login：用户登录
- POST /api/auth/logout：用户登出
- GET /api/users/me：获取当前用户信息

### 4.2 用户管理接口
- GET /api/users/pending：获取待审批用户列表（根据当前用户角色和reportingTo字段筛选）
- POST /api/users/approve：审批用户（仅审批向当前用户汇报的Employee或Admin申请）
- POST /api/users/reject：拒绝用户申请

### 4.3 日志接口
- GET /api/daily-log：获取日志列表（根据当前用户角色和reportingTo关系筛选）
- POST /api/daily-log：创建日志
- PUT /api/daily-log/[id]：更新日志
- DELETE /api/daily-log/[id]：删除日志（软删除）

### 4.4 学院管理接口（CEO专用）
- GET /api/colleges：获取学院列表
- POST /api/colleges：创建学院（请求体包含name、address、spocName、spocContact、spocMailId、spocInTouractName、spocInTouractNumber、spocInTouractMail、mouDuration、status、description）
- PUT /api/colleges/[id]：更新学院
- DELETE /api/colleges/[id]：删除学院

### 4.5 公司管理接口（CEO专用）
- GET /api/companies：获取公司列表
- POST /api/companies：创建公司（请求体包含name、address、spocName、spocContact、spocMailId、spocInTouractName、spocInTouractNumber、spocInTouractMail、mouDuration、status、description）
- PUT /api/companies/[id]：更新公司
- DELETE /api/companies/[id]：删除公司

### 4.6 仪表盘接口
- GET /api/dashboard/metrics：获取仪表盘数据（根据当前用户角色和reportingTo关系筛选统计数据）

## 5. 前端页面

### 5.1 公共页面
- /（首页）：未登录显示登录/注册入口，已登录跳转至对应角色仪表盘
- /register：注册页面（Employee注册时需选择汇报对象）
- /login：登录页面

### 5.2 CEO仪表盘（/dashboard/ceo）
- 审批面板：待审批Admin和选择向CEO汇报的Employee列表
- 日志面板：CEO个人日志提交表单和历史记录，以及向CEO汇报的Employee日志
- 学院管理面板：学院列表、CRUD操作、状态筛选；新增/编辑表单包含以下字段：
  - Name
  - Address
  - SPOC Name
  - SPOC Contact
  - SPOC Mail ID
  - SPOC from InTouract - Name
  - SPOC from InTouract - Number
  - SPOC from InTouract - Mail
  - Duration of the MoU
  - Status
  - Description
- 公司管理面板：公司列表、CRUD操作、状态筛选；新增/编辑表单包含以下字段：
  - Name
  - Address
  - SPOC Name
  - SPOC Contact
  - SPOC Mail ID
  - SPOC from InTouract - Name
  - SPOC from InTouract - Number
  - SPOC from InTouract - Mail
  - Duration of the MoU
  - Status
  - Description
- 综合概览面板：统计数据和未提交用户列表（仅显示向CEO汇报的用户）

### 5.3 COO/CTO等高级管理角色仪表盘（/dashboard/coo 或 /dashboard/cto）
- 审批面板：选择向该角色汇报的Employee列表
- 团队日志面板：向该角色汇报的Employee日志，支持日期和状态筛选
- 个人日志面板：该角色自己的日志提交和历史
- 综合概览面板：统计数据和未提交用户列表（仅显示向该角色汇报的用户）

### 5.4 Admin仪表盘（/dashboard/admin）
- 审批面板：选择向Admin汇报的Employee列表
- 团队日志面板：向Admin汇报的Employee日志，支持日期和状态筛选
- 个人日志面板：Admin自己的日志提交和历史

### 5.5 Employee仪表盘（/dashboard）
- 个人资料：显示用户信息
- 日志管理：日志提交表单和历史记录表格

### 5.6 共享组件
- Sidebar：角色感知的侧边栏导航
- Topbar：顶部栏，包含用户下拉菜单和登出按钮
- LogForm：日志提交/编辑模态框
- Table：支持服务端分页的表格组件
- CollegeForm / CompanyForm：学院/公司新增与编辑模态框，包含上述全部字段

## 6. 安全与权限

### 6.1 服务端验证
- 所有API路由必须验证JWT和用户角色
- 用户只能操作自己的日志
- CEO专属功能（学院/公司管理）需验证CEO角色
- 审批和日志查看权限需验证reportingTo关系，确保管理角色仅能访问向其汇报的Employee数据

### 6.2 前端安全
- 使用fetch时包含credentials以传递Cookie
- 使用Zod进行表单验证
- 根据权限禁用UI操作按钮
- 显示友好的空状态提示

### 6.3 密码安全
- 使用bcrypt加密密码，SALT_ROUNDS=10
- 首次登录后建议CEO修改密码
- 实现密码修改功能

## 7. 部署配置

### 7.1 环境变量
- DATABASE_URL：Supabase PostgreSQL连接字符串
- JWT_SECRET：JWT签名密钥
- CEO_EMAIL：intouract.22@gmail.com
- CEO_PASSWORD：InTouract@1438
- SALT_ROUNDS：10
- NEXT_PUBLIC_APP_NAME：InTouract
- NODE_ENV：production

### 7.2 数据库迁移与种子数据
- 使用Prisma Migrate进行数据库迁移
- 种子脚本仅创建CEO账户（从环境变量读取邮箱和密码）
- 部署后执行命令：npx prisma migrate deploy && ts-node prisma/seed.ts

### 7.3 Replit部署步骤
1. 创建新Repl（导入代码仓库或从生成代码创建）
2. 在Replit Secrets中添加所有环境变量
3. 运行 npm ci 或 pnpm install
4. 运行 npx prisma migrate deploy
5. 运行 ts-node prisma/seed.ts
6. 启动Repl或点击Deploy，应用将在Repl公共URL上可访问

### 7.4 package.json脚本
- dev：next dev -p 3000
- build：next build
- start：next start -p 3000
- prisma:migrate：prisma migrate deploy
- prisma:seed：ts-node prisma/seed.ts

## 8. 数据约束

### 8.1 种子数据
- 仅包含一个CEO账户（邮箱：intouract.22@gmail.com，密码：InTouract@1438）
- 不包含任何模拟用户或示例日志
- CEO账户状态为ACTIVE，systemRole为CEO

### 8.2 数据持久化
- 所有数据必须通过数据库持久化
- 禁止使用内存中的模拟数据

### 8.3 功能限制
- 不包含任务分配功能
- Admin晋升必须由CEO完成
- Employee激活必须由其选择的汇报对象完成
- 管理角色仅能访问向其汇报的Employee数据

## 9. 测试要求

### 9.1 单元测试
- 认证流程测试：注册 → CEO审批 → Admin审批Employee
- 汇报关系测试：Employee选择COO汇报 → 仅COO可见审批请求和日志

### 9.2 集成测试
- Employee创建日志 → 其汇报对象查看日志
- 权限隔离测试：CEO无法查看向COO汇报的Employee日志

## 10. 设计风格

- 配色方案：采用专业的企业级配色，主色调为深蓝色（#1E40AF），辅助色为浅灰色（#F3F4F6）和白色，强调色为绿色（#10B981）用于成功状态
- 布局方式：采用侧边栏+主内容区的经典后台布局，侧边栏固定，主内容区可滚动
- 视觉细节：使用中等圆角（8px），卡片式设计带有轻微阴影，按钮采用实心填充样式，表格使用斑马纹提升可读性
- 交互反馈：按钮hover状态有颜色加深效果，表单验证错误显示红色提示，操作成功显示绿色Toast提示