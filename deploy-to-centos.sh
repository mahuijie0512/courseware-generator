#!/bin/bash
# CentOS 7 部署脚本 - 高中课件生成器

echo "=== 开始部署高中课件生成器到CentOS 7 ==="

# 1. 更新系统
echo "更新系统包..."
sudo yum update -y

# 2. 安装Nginx
echo "安装Nginx..."
sudo yum install -y epel-release
sudo yum install -y nginx

# 3. 启动并启用Nginx
echo "启动Nginx服务..."
sudo systemctl start nginx
sudo systemctl enable nginx

# 4. 配置防火墙
echo "配置防火墙..."
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# 5. 创建网站目录
echo "创建网站目录..."
sudo mkdir -p /var/www/courseware-generator
sudo chown -R nginx:nginx /var/www/courseware-generator

# 6. 配置Nginx虚拟主机
echo "配置Nginx..."
sudo tee /etc/nginx/conf.d/courseware.conf > /dev/null <<EOF
server {
    listen 80;
    server_name 192.168.139.131;
    root /var/www/courseware-generator;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# 7. 测试Nginx配置
echo "测试Nginx配置..."
sudo nginx -t

# 8. 重启Nginx
echo "重启Nginx..."
sudo systemctl restart nginx

# 9. 显示状态
echo "=== 部署完成 ==="
echo "Nginx状态:"
sudo systemctl status nginx --no-pager
echo ""
echo "网站访问地址: http://192.168.139.131"
echo "文件上传目录: /var/www/courseware-generator"
echo ""
echo "接下来需要上传网站文件到 /var/www/courseware-generator 目录"