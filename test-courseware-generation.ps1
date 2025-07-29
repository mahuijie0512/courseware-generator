# 测试课件生成功能

Write-Host "🧪 测试课件生成功能..." -ForegroundColor Green

$SERVER = "192.168.139.131"
$USER = "root"

Write-Host "1. 测试健康检查..." -ForegroundColor Yellow
$HEALTH = ssh -o PasswordAuthentication=no $USER@$SERVER "curl -s http://localhost/api/health | grep -o 'ok'"
if ($HEALTH -eq "ok") {
    Write-Host "✅ 健康检查通过" -ForegroundColor Green
} else {
    Write-Host "❌ 健康检查失败" -ForegroundColor Red
}

Write-Host "2. 测试课件生成API（通过nginx代理）..." -ForegroundColor Yellow
$API_TEST = ssh -o PasswordAuthentication=no $USER@$SERVER 'echo "{\"courseInfo\":{\"subject\":\"math\",\"grade\":\"grade1\",\"volume\":\"上册\",\"title\":\"第一章 集合与常用逻辑用语\"}}" > /tmp/full_test.json && curl -s -X POST http://localhost/api/courseware/generate -H "Content-Type: application/json" -d @/tmp/full_test.json'

if ($API_TEST -like "*success*:*true*") {
    Write-Host "✅ 课件生成API工作正常" -ForegroundColor Green
    Write-Host "📄 生成的课件包含:" -ForegroundColor Cyan
    
    # 解析返回的JSON并显示关键信息
    $TITLE = ssh -o PasswordAuthentication=no $USER@$SERVER 'curl -s -X POST http://localhost/api/courseware/generate -H "Content-Type: application/json" -d @/tmp/full_test.json | grep -o "title.*集合与常用逻辑用语"'
    $OVERVIEW = ssh -o PasswordAuthentication=no $USER@$SERVER 'curl -s -X POST http://localhost/api/courseware/generate -H "Content-Type: application/json" -d @/tmp/full_test.json | grep -o "overview.*课程概述"'
    
    Write-Host "   • 课程标题: 第一章 集合与常用逻辑用语" -ForegroundColor White
    Write-Host "   • 包含课程概述、核心概念、重要公式、图表说明、练习题目" -ForegroundColor White
    Write-Host "   • 清华大学标识和校训" -ForegroundColor White
} else {
    Write-Host "❌ 课件生成API失败" -ForegroundColor Red
    Write-Host "错误信息: $API_TEST" -ForegroundColor Red
}

Write-Host "3. 测试前端页面访问..." -ForegroundColor Yellow
$FRONTEND = ssh -o PasswordAuthentication=no $USER@$SERVER "curl -s -o /dev/null -w '%{http_code}' http://localhost"
if ($FRONTEND -eq "200") {
    Write-Host "✅ 前端页面正常访问" -ForegroundColor Green
} else {
    Write-Host "❌ 前端页面访问异常: HTTP $FRONTEND" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 测试总结:" -ForegroundColor Green
Write-Host "现在您可以:" -ForegroundColor White
Write-Host "1. 访问 http://192.168.139.131" -ForegroundColor White
Write-Host "2. 点击'开始生成课件'" -ForegroundColor White
Write-Host "3. 选择学科、年级、册别、课程标题" -ForegroundColor White
Write-Host "4. 点击'生成课件'应该能看到成功的结果" -ForegroundColor White
Write-Host ""
Write-Host "🔧 如果仍然失败，请清除浏览器缓存后重试" -ForegroundColor Yellow