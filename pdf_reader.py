#!/usr/bin/env python3
"""
PDF文件读取工具
支持提取PDF文本内容，特别适用于教育资源处理
"""

import sys
import pdfplumber
from pathlib import Path

def extract_pdf_text(pdf_path, page_range=None):
    """
    从PDF文件中提取文本内容
    
    Args:
        pdf_path: PDF文件路径
        page_range: 页面范围，如 (1, 5) 表示第1-5页
    
    Returns:
        提取的文本内容
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            text_content = []
            
            # 确定页面范围
            total_pages = len(pdf.pages)
            if page_range:
                start_page, end_page = page_range
                start_page = max(0, start_page - 1)  # 转换为0索引
                end_page = min(total_pages, end_page)
            else:
                start_page, end_page = 0, total_pages
            
            print(f"正在处理PDF文件: {pdf_path}")
            print(f"总页数: {total_pages}, 处理页面: {start_page + 1}-{end_page}")
            
            # 逐页提取文本
            for page_num in range(start_page, end_page):
                page = pdf.pages[page_num]
                page_text = page.extract_text()
                
                if page_text:
                    text_content.append(f"\n=== 第 {page_num + 1} 页 ===\n")
                    text_content.append(page_text)
                    text_content.append("\n" + "="*50 + "\n")
            
            return "".join(text_content)
            
    except Exception as e:
        return f"读取PDF文件时出错: {str(e)}"

def main():
    if len(sys.argv) < 2:
        print("使用方法: python pdf_reader.py <PDF文件路径> [起始页] [结束页]")
        print("示例: python pdf_reader.py textbook.pdf")
        print("示例: python pdf_reader.py textbook.pdf 1 10")
        return
    
    pdf_path = sys.argv[1]
    
    # 检查文件是否存在
    if not Path(pdf_path).exists():
        print(f"错误: 文件 {pdf_path} 不存在")
        return
    
    # 解析页面范围
    page_range = None
    if len(sys.argv) >= 4:
        try:
            start_page = int(sys.argv[2])
            end_page = int(sys.argv[3])
            page_range = (start_page, end_page)
        except ValueError:
            print("错误: 页面范围必须是数字")
            return
    
    # 提取文本
    text_content = extract_pdf_text(pdf_path, page_range)
    
    # 输出结果
    print("\n" + "="*60)
    print("PDF文本内容:")
    print("="*60)
    print(text_content)
    
    # 保存到文件
    output_file = Path(pdf_path).stem + "_extracted.txt"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(text_content)
    
    print(f"\n文本内容已保存到: {output_file}")

if __name__ == "__main__":
    main()