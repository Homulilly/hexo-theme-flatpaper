# 功能说明

## 响应式布局

FlatPaper 使用：

- 首页 / 列表页三栏
- 文章页两栏
- 窄屏下移动端侧栏抽屉

移动端顶部导航只保留：

- 侧栏菜单
- 站点标题
- 搜索
- 明暗切换

Brandmark 链接组会移动到侧栏作者卡片下方，主题色点则直接显示在抽屉顶部，与关闭按钮同排。

根层会裁剪横向溢出，避免固定全屏背景 / 遮罩在移动调试视口里产生横向滚动条。

## 封面图

文章卡片和精选图按以下顺序解析：

1. `cover`
2. `thumbnail`
3. `image`
4. `banner`
5. 渲染正文中的第一张 `<img>`

没有图片时使用 CSS 插画回退。

## 搜索

点击 Header 放大镜或按 `Ctrl+K` / `Cmd+K` 打开搜索。

搜索索引在构建时生成为独立文件 `flatpaper-search.json`，首次打开搜索面板时按需加载，不内联进页面。`search.limit` 可限制为最新 N 篇文章。匹配关键词会用 `<mark>` 高亮。

## 深色模式与主题色

深色模式存储在 `localStorage['flatpaper-mode']`，并在绘制前恢复状态。

主题色由 `color` 配置默认值，用户也可以手动切换：

- 桌面端：Header 调色盘
- 移动端：侧栏顶部色点

选择结果存储在 `flatpaper-accent` cookie。

## 精选轮播

`featured` 可在首页第 1 页置顶最多四篇文章。

行为：

- 1 篇：静态卡片
- 2 到 4 篇：轮播
- 支持箭头按钮
- 支持圆点指示器
- 支持键盘左右键
- 自动播放会在 hover / focus 时暂停

## 文章体验

文章页包含：

- 粘性 TOC
- 封面感知的文章头部
- 上一篇 / 下一篇
- 相关文章卡片
- 评论跳转按钮
- 分享按钮
- 可选自定义 reaction 按钮

## 代码块

代码块包含：

- 从 highlight class 自动识别语言徽标
- 复制按钮
- 折叠按钮
- 单击 gutter 行号高亮
- 双击 gutter 行号复制该行
- `dark`、`sand`、`light`、`simple` 代码主题

纯文本别名（`plain`、`plaintext`、`text`、`txt`、`none`、`raw`）会隐藏语言徽标。

## 友链页

`type: links` 读取 `source/_data/links.yml`。

卡片支持：

- 分组
- 头像图片
- 首字母头像回退
- 描述
- 可选 RSS 徽标
- hover 信号脉冲动画
- 链接数据下方继续渲染页面 markdown 正文

## 多语言界面

FlatPaper 的内置界面文案已本地化，根据 Hexo 站点 `language` 配置选择，支持 `zh-CN` 与 `en`，并回退到 `zh-CN`。

- 模板文案通过主题 i18n helper 解析，数据来自 `languages/zh-CN.yml` 与 `languages/en.yml`。
- `source/js/main.js` 运行时用到的文案（搜索状态、代码控件、锚点标签）以 `window.FLATPAPER_I18N` 注入页面，不在脚本中硬编码。
- 只翻译主题界面文案，文章内容和站点数据保持原样。

选择规则见[配置说明 → 语言](configuration.md#语言)。

## 可选集成

FlatPaper 内置可选接入：

- Twikoo
- Artalk
- Fancybox
- Umami
- Google AdSense
- RSS 资料链接
- 自定义 HTML 注入
