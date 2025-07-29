# 部署脚本模板
# 复制此文件为 deploy.ps1 并填入实际的服务器信息

Write-Host "开始部署课件生成器..." -ForegroundColor Green

# 配置变量 - 请根据实际情况修改
$SERVER = "your-server-ip"
$USER = "your-username"
$PROJECT_PATH = "/path/to/your/project"
$SSH_KEY = "path/to/your/ssh/key"  # 可选，如果使用SSH密钥

# 1. 备份原始文件
Write-Host "备份原始文件..." -ForegroundColor Yellow
# ssh $USER@$SERVER "cp $PROJECT_PATH/current-file $PROJECT_PATH/backup-file"

# 2. 上传新文件
Write-Host "上传新文件..." -ForegroundColor Yellow
# scp your-local-file $USER@$SERVER:$PROJECT_PATH/

# 3. 重新构建项目
Write-Host "重新构建项目..." -ForegroundColor Yellow
# ssh $USER@$SERVER "cd $PROJECT_PATH && npm run build"

# 4. 重启服务
Write-Host "重启服务..." -ForegroundColor Yellow
# ssh $USER@$SERVER "pm2 restart all"

# 5. 验证部署
Write-Host "验证部署..." -ForegroundColor Yellow
# $HTTP_STATUS = ssh $USER@$SERVER "curl -s -o /dev/null -w '%{http_code}' http://localhost"
# Write-Host "HTTP状态码: $HTTP_STATUS" -ForegroundColor Cyan

Write-Host "部署完成！" -ForegroundColor Green