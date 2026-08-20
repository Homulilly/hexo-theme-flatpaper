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

## 首页开屏 Hero

`home_hero` 可在首页第 1 页增加一个可选的首屏介绍区。

它可以展示：

- 站点标题或自定义开屏标题
- profile 中的角色、简介、头像、社交链接与 RSS 链接
- 内置手账纸张背景
- 固定背景图，或从图片数组中随机选择一张
- 可配置的图片暗色遮罩
- 跳入首页内容区的底部贴纸按钮
- 可拖动的手账贴纸
- 最多 5 张自定义图片贴纸，并可带访问确认链接

Hero 默认关闭；只有设置 `home_hero.enable: true` 后才会替换普通首页开头。

可用配置见[配置说明 → 首页开屏](configuration.md#首页开屏)。

### 渐进式大图加载

`home_hero.image_progressive` 为开屏背景启用 Medium 风格的渐进加载与滚动离场：

```yaml
home_hero:
  enable: true
  image: /images/hero.jpg
  image_progressive: true
  image_placeholder: /images/hero-lqip.jpg   # 可选
```

- 先铺一张高斯模糊的小图（`image_placeholder`），背景大图解码完成后淡出交接；未配置小图时模糊层用纸面底色，仍有淡入
- 入场：照片层延迟 0.5s 后从 `scale(1.5)` 缩回 `1` 并由透明淡入，2.2s（沿用 pr-9 的时序与曲线）
- 滚动离场：照片层放大 `+0.1` 并随进度线性渐隐至全透明。淡出只作用在照片层（位于贴纸与 profile 卡片之下），内容不受影响
- **渐进加载是 `image` 的加载表现，不是第二个图源**：照片层由模板渲染、始终存在、消费同一个 `--hero-bg-image`，所以 `image_overlay`、`mobile_image`、多图轮播全部照常生效
- 失败即降级：图片 404、脚本报错、`main.js` 未执行或禁用 JS 时，直接显示 `image` 本身（模糊层带 `hidden`，由紧随其后的内联脚本解除，2 秒内没人接管就重新藏回去）
- 只用 `transform` 与 `opacity` 驱动滚动，不用 `filter`，避免全屏模糊的逐帧重栅格化
- `prefers-reduced-motion` 下不注册滚动监听
- `image_placeholder` 不要填随机图接口，否则模糊层预览的是另一张照片

### 滚动渐入

首页模块（featured 轮播、章节标题、文章卡片，以及侧栏的 profile / 分类 / 标签卡）进入视口时逐个上浮渐显：

- 元素带 `reveal` 类，`main.js` 用 IntersectionObserver 在进入视口时添加 `is-revealed`，只触发一次
- 文章卡片按索引交错出场（每 60ms 递增，上限 300ms），延迟通过 `--reveal-delay` 自定义属性传入，不会影响卡片自身的 hover 过渡
- 出场动画结束后不残留任何 `transform` 声明，因此卡片的 hover 抬升照常生效
- 隐藏由 `<html class="reveal-ready">` 控制，该类由 head 内联脚本在首屏绘制前添加。没有 JS、浏览器不支持 IntersectionObserver、或 `main.js` 未能执行时都不会隐藏（最后一种由 2 秒兜底移除该类），内容始终可见
- `prefers-reduced-motion` 下直接显示，不做动画
- 自定义页面给元素加 `reveal` 类即可复用；需要错开出场时再加内联 `--reveal-delay`

## 封面图

文章卡片和精选图按以下顺序解析：

1. `cover`
2. `thumbnail`
3. `image`
4. `banner`
5. 渲染正文中的第一张 `<img>`

没有图片时使用 CSS 插画回退。

当 `post_top_img.mode` 为 `top_img` 或 `fallback` 时，文章页顶部会渲染解析到的顶部图。标题直接叠加在图片上，图片在下方渐变回纸面。文章 front-matter 中的 `top_img` 优先级最高，`top_img: false` 可关闭单篇顶部图。

独立页面和特殊 `type:` 页面也支持页面自己的 `top_img`。页面顶部图不读取 `post_top_img`，也不回退到其它字段；只有当前页面 front-matter 写了 `top_img` 时才会显示。

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

## 赞赏名单

在关于页等独立页面的正文中放入结构化 HTML，即可获得手账便签风格的赞赏名单卡片。每张卡片是带胶带、轻微歪斜的纸条，右上角可选圆形头像。

```html
<div class="reward-list">
  <div class="reward-list__item reward-list__item--p1">
    <img class="reward-list__avatar no-zoom" src="/images/donor.jpg" alt="昵称" loading="lazy" referrerpolicy="no-referrer">
    <span class="reward-list__name">昵称</span>
    <div class="reward-list__bottom">
      <span class="reward-list__amount">¥100</span>
      <time class="reward-list__date">2026-01-01</time>
    </div>
  </div>
</div>
<p class="reward-list__total">共 <strong>1</strong> 人 · 最新更新时间：<time datetime="2026-01-01">2026-01-01</time></p>
```

特性：

- **金额档位配色**：JS 自动解析金额文本并着色，无需手写样式类——≥100 红、≥50 绿、≥20 棕黄、≥10 蓝、≥5 紫、≥1 橄榄绿（对应人民币纸币色）。手动添加 `reward-list__amount--100` 之类的类可显式覆盖。
- **循环配色**：`--p1` 到 `--p5` 五个纸色档位（红/蓝/绿/橙/紫），胶带颜色随纸色切换。
- **头像**：`no-zoom` 圆形头像贴在右上角；省略 `img` 时可用 `.reward-list__avatar--text` 显示名字首字符回退。
- **响应式**：桌面多列自动排布，窄屏降为单列；支持深色模式与 `prefers-reduced-motion`。

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
- Google Analytics 4
- Google AdSense
- RSS 资料链接
- 自定义 HTML 注入
