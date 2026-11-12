# 布局与开发

## 布局文件

| 布局 | 文件 | 用途 |
| --- | --- | --- |
| Home | `layout/index.ejs` | 精选轮播与分页文章网格 |
| Post | `layout/post.ejs` | 文章、reaction、上一篇 / 下一篇、相关文章 |
| Page | `layout/page.ejs` | 默认页面与 `type:` 路由 |
| Friends | `layout/link.ejs` | 友链网格 |
| Archive | `layout/archive.ejs` | 按日期分组的文章列表 |
| Category index | `layout/categories.ejs` | 分类云 / 网格 |
| Category | `layout/category.ejs` | 单个分类下的文章 |
| Tag index | `layout/tags.ejs` | 标签云 |
| Tag | `layout/tag.ejs` | 单个标签下的文章 |

## 共享 partial

- `head.ejs`：meta 与 stylesheet
- `header.ejs`：品牌、桌面导航、搜索、调色盘、明暗切换、移动端抽屉按钮
- `footer.ejs`：页脚版权、主题署名与结构化链接
- `home-hero.ejs`：可选首页开屏、profile 链接、图片贴纸与滚动入口
- `sidebar-right.ejs`：视觉左侧栏与移动端抽屉
- `sidebar-left.ejs`：首页 / 列表页视觉右侧栏
- `random-posts.ejs`：随机文章卡片
- `post-card.ejs`：首页 / 网格卡片
- `archive-list.ejs`：分页归档 / 分类 / 标签列表
- `thumbnail.ejs`：封面图与 CSS 回退
- `search.ejs`：搜索弹窗与 JSON 索引
- `icons.ejs`：图标查找

## 侧栏布局说明

DOM 中视觉左列由 `sidebar-right.ejs` 渲染，包含 profile、文章页 TOC、分类、标签、brand links 与移动端抽屉工具。

视觉右列由 `sidebar-left.ejs` 渲染，在首页 / 列表页包含欢迎卡片和随机文章。

这个顺序让更常用的侧栏在窄屏下成为汉堡按钮控制的抽屉。

文章页跳过 `sidebar-left`，只保留一个侧栏。

## 目录结构

```text
themes/flatpaper/
|-- _config.yml
|-- _config.en.yml
|-- docs/
|-- languages/
|   |-- zh-CN.yml
|   `-- en.yml
|-- layout/
|   |-- _partial/
|   `-- *.ejs
|-- scripts/
|   |-- i18n.js
|   |-- menu-helpers.js
|   |-- search-index.js
|   |-- tags.js
|   |-- note-container.js
|   `-- _note-types.js
`-- source/
    |-- css/
    |   |-- style.styl
    |   `-- _partials/
    |       |-- var.styl
    |       |-- base.styl
    |       |-- _layout/
    |       |-- _global/
    |       |-- _components/
    |       |-- _page/
    |       `-- _mode/
    `-- js/
        `-- main.js
```

## 手绘设计规范

主题的手帐风格由 `source/css/_partials/var.styl` 中的一组共享变量驱动。新增或修改组件时优先复用它们，而不是重新写一份胶带、阴影或手绘线条。

| 元素 | 变量 / 写法 | 用法 |
| --- | --- | --- |
| 纸张 | `--paper`、`--radius-paper`、`filter: url(#paper-edge)` | 卡片本体：伪元素铺纸色，再用 `#paper-edge` 滤镜做出撕边 |
| 层次 | `--sheet-shadow` → `--soft-shadow` / `--small-shadow` → `--shadow` | 平放在桌面 → 被拿起 → hover 抬起，三级阴影都由 `--paper-shadow-rgb` 着色 |
| 手绘圆角 | `--radius-handdrawn`、`--radius-handdrawn-wide`、`--radius-sketch` | 前两个用于按钮、标签、输入框、索引卡；`--radius-sketch` 用于选项卡这类大矩形 |
| 胶带 | `--tape-color`、`--tape-w` | 配方统一写在 `_layout/tape.styl`，组件只声明位置、角度和颜色 |
| 荧光笔 | `--highlighter`、`.marker-swipe` | 标题下的荧光笔底色（精选标题、欢迎卡片），以及所有文字链接 hover 时从左划过的荧光笔，配方在 `_global/marker-swipe.styl` |
| 笔迹 | `--mask-squiggle`、`--mask-wave`、`--mask-arrow`、`--mask-check` | 作为 `mask` 使用，用 `background-color` 上色，因此自动跟随强调色与深色模式 |
| 标记 | `.dot`、`.green-dot` | 倾斜的手绘小方块，用作条目前的标记：分类、欢迎卡片、搜索标题、主题色色块、目录当前项都用这一个形状 |
| 标签 | `--label-fill`、`--label-text` | `.label-pill` 等实色小标签 |
| 动效 | `--ease-paper`、`--ease-spring` | 纸张落定用 `--ease-paper`，贴纸类回弹用 `--ease-spring` |
| 焦点 | 全局 `:focus-visible` | 统一的虚线铅笔圈，定义在 `base.styl`，组件无需单独处理 |

约定：

- 虚线（`--dash` / `--line`）表示折痕与分隔，实线只用于需要强调的边框（表头下划线、代码框）。
- 文字链接 hover 统一用荧光笔划过：给包住链接文字的行内元素加 `.marker-swipe`，或把选择器加入 `_global/marker-swipe.styl`；正文链接常驻一道荧光笔，hover 时再划一遍加深；其余位置的链接常驻不加装饰。
- 前进 / 后退类的文字入口（欢迎卡片的行动按钮、阅读全文、列表分页）不加方框，用 `_global/arrow-link.styl`：文字加一支手绘箭头，hover 时文字划过荧光笔、箭头朝所指方向滑动。
- 带方框的文字按钮用 `_global/paper-button.styl` 的纸片按钮（目前是 404 操作），新按钮把选择器加入该文件即可。
- 倾斜角度保持在 ±1° 左右，相邻元素方向交替，避免整排朝同一方向歪。
- 装饰只出现在容器边缘（胶带、撕边、笔迹下划线），正文区域保持干净以保证阅读。

## JavaScript 职责

`source/js/main.js` 负责：

- 深色模式切换
- 主题色菜单与移动端色点
- 搜索弹窗
- 标题锚点
- TOC scrollspy 与 bottom lock
- 首页开屏随机背景、滚动箭头、贴纸重排、贴纸拖拽与访问确认
- 精选轮播
- 移动端侧栏抽屉
- 桌面与抽屉二级菜单
- 代码块复制 / 折叠 / 行号交互
- tabs 交互
- reaction 弹层
- 评论跳转 / 分享按钮
- Fancybox 内容包裹
- 从 `window.FLATPAPER_I18N` 读取本地化运行时文案

## 国际化

内置界面文案通过 `scripts/i18n.js` 本地化，它注册 EJS helper，并从 `languages/zh-CN.yml` 与 `languages/en.yml` 读取翻译表。

- `flatpaper_i18n('key.path', ...args)` 返回翻译后的字符串，支持 `%s` / `%d` 占位替换；缺失时回退到 `zh-CN`，再回退到键名本身。
- `flatpaper_i18n_language()` 返回解析出的语言（`zh-CN` 或 `en`）。
- `flatpaper_i18n_json()` 把扁平化的翻译表序列化进页面；`layout/layout.ejs` 将其注入为 `window.FLATPAPER_I18N`，供 `main.js` 通过 `t()` helper 在运行时解析相同的键。
- 翻译键按页面 / 组件分组（`common`、`pagination`、`index`、`post`、`search`、`code`、`head`、`navigation`、`colors`、`home_hero` 等）。请保持 `zh-CN.yml` 与 `en.yml` 同步；helper 会把嵌套键扁平化为点号路径（如 `search.empty`）。

代码注释、slug 清洗正则，以及中文文档 / 配置示例有意不纳入抽取。

## 构建检查

在使用该主题的 Hexo 站点中：

```bash
hexo generate --config _config.yml,_config.flatpaper.yml
```

在当前 demo workspace 中：

```bash
pnpm build -- --config _config.yml,_config.flatpaper.yml
```
