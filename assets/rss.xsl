<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns="http://www.w3.org/1999/xhtml">

  <xsl:output method="html" version="1.0" encoding="utf-8" indent="yes"/>

  <xsl:template match="/">
    <html lang="zh-CN">
      <head>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1"/>
        <title><xsl:value-of select="/rss/channel/title"/> · 订阅</title>
        <style>
          :root{
            --paper:#f4ecdd; --paper-raise:#fdf9f0; --ink:#241d16; --ink-soft:#6f6455;
            --line:#ded0b4; --cinnabar:#9c2b24; --gold:#a97f31; --jade:#33654e;
            --font-serif:Georgia,"Songti SC","SimSun","Noto Serif SC",serif;
            --font-sans:"PingFang SC","Microsoft YaHei",system-ui,sans-serif;
          }
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:var(--paper);color:var(--ink);font-family:var(--font-sans);line-height:1.7;padding:32px 16px}
          .wrap{max-width:720px;margin:0 auto}
          header{border-bottom:2px solid var(--gold);padding-bottom:14px;margin-bottom:22px}
          h1{font-family:var(--font-serif);font-size:28px;letter-spacing:.12em;color:var(--cinnabar)}
          .desc{color:var(--ink-soft);font-size:14px;margin-top:4px}
          .meta{font-size:12.5px;color:var(--ink-soft);margin-top:8px}
          .meta a{color:var(--jade)}
          ul{list-style:none}
          li{background:var(--paper-raise);border:1px solid var(--line);border-radius:12px;padding:14px 18px;margin-bottom:12px}
          li:hover{border-color:var(--gold)}
          a.item-title{display:block;font-family:var(--font-serif);font-size:18px;color:var(--ink);text-decoration:none;letter-spacing:.04em}
          a.item-title:hover{color:var(--cinnabar)}
          .pub{font-size:12px;color:var(--ink-soft);margin-top:2px}
          .cats{margin-top:8px}
          .cat{display:inline-block;font-size:11.5px;color:var(--jade);border:1px solid var(--line);border-radius:999px;padding:1px 10px;margin-right:6px}
          .snippet{font-size:13px;color:var(--ink-soft);margin-top:8px}
          footer{margin-top:26px;font-size:12px;color:var(--ink-soft);text-align:center}
        </style>
      </head>
      <body>
        <div class="wrap">
          <header>
            <h1><xsl:value-of select="/rss/channel/title"/></h1>
            <p class="desc"><xsl:value-of select="/rss/channel/description"/></p>
            <p class="meta">
              更新于 <xsl:value-of select="/rss/channel/lastBuildDate"/> · 共
              <xsl:value-of select="count(/rss/channel/item)"/> 篇 ·
              <a href="/rss.xml">订阅源</a>（RSS） / <a href="/atom.xml">Atom</a>
            </p>
          </header>
          <ul>
            <xsl:for-each select="/rss/channel/item">
              <li>
                <a class="item-title" href="{substring-after(substring-after(link, '://'), '/')}"><xsl:value-of select="title"/></a>
                <p class="pub"><xsl:value-of select="pubDate"/></p>
                <p class="cats">
                  <xsl:for-each select="category">
                    <span class="cat"><xsl:value-of select="."/></span>
                  </xsl:for-each>
                </p>
                <p class="snippet">
                  <xsl:value-of select="substring(description, 1, 220)"/>…
                </p>
              </li>
            </xsl:for-each>
          </ul>
          <footer>由 post-generator 铸造 · 纯静态订阅页</footer>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
