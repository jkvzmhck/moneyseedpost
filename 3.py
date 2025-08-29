import os
import requests
from datetime import datetime

# 你的站点域名
SITE_URL = "https://www.yourdomain.com"

# 文章所在目录
CONTENT_DIRS = ["./"]

# sitemap 文件路径
SITEMAP_FILE = "sitemap.xml"

# 日志文件
LOG_FILE = "sitemap_update.log"


def log_message(message: str):
    """写入日志文件并打印"""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log_entry = f"[{timestamp}] {message}\n"
    print(log_entry.strip())
    with open(LOG_FILE, "a", encoding="utf-8") as log:
        log.write(log_entry)


def generate_sitemap():
    urls = []
    for content_dir in CONTENT_DIRS:
        for root, dirs, files in os.walk(content_dir):
            for file in files:
                if file.endswith(".html"):
                    path = os.path.join(root, file).replace("\\", "/")
                    url = SITE_URL + path.replace("./", "/")
                    lastmod = datetime.fromtimestamp(os.path.getmtime(path)).strftime("%Y-%m-%d")
                    urls.append((url, lastmod))

    sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
    sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    for url, lastmod in urls:
        sitemap += "  <url>\n"
        sitemap += f"    <loc>{url}</loc>\n"
        sitemap += f"    <lastmod>{lastmod}</lastmod>\n"
        sitemap += "    <changefreq>weekly</changefreq>\n"
        sitemap += "    <priority>0.8</priority>\n"
        sitemap += "  </url>\n"

    sitemap += "</urlset>"

    with open(SITEMAP_FILE, "w", encoding="utf-8") as f:
        f.write(sitemap)

    log_message(f"✅ 已更新 {SITEMAP_FILE}，共收录 {len(urls)} 个页面。")
    return urls


def ping_search_engines():
    sitemap_url = f"{SITE_URL}/{SITEMAP_FILE}"
    search_engines = {
        "Google": f"http://www.google.com/ping?sitemap={sitemap_url}",
        "Bing": f"http://www.bing.com/ping?sitemap={sitemap_url}"
    }

    for name, url in search_engines.items():
        try:
            r = requests.get(url, timeout=10)
            if r.status_code == 200:
                log_message(f"📡 成功通知 {name}")
            else:
                log_message(f"⚠️ 通知 {name} 失败，状态码 {r.status_code}")
        except Exception as e:
            log_message(f"❌ 无法连接 {name}: {e}")


if __name__ == "__main__":
    urls = generate_sitemap()
    ping_search_engines()

    # 打印收录的文章列表
    log_message("📄 收录的页面列表：")
    for url, lastmod in urls:
        log_message(f"   - {url} (更新于 {lastmod})")

    log_message(f"=== 本次更新完成，共收录 {len(urls)} 篇文章 ===\n")
