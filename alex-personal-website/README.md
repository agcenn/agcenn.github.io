# ALEX GUAN YAN CEN CEN — Personal Website

这是一个可以直接部署到 GitHub Pages 的静态个人主页，不需要安装依赖，也不需要服务器。网站采用与 dfshan.net 相近的 Material for MkDocs 文档式布局，并支持中文、英语和西班牙语切换。

## 本地查看

直接双击 `index.html` 即可预览。为了获得和线上一致的效果，也可以在当前文件夹启动一个本地静态服务器。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个公开仓库。
2. 把本文件夹里的所有文件上传到仓库的默认分支（通常是 `main`）。
3. 打开仓库的 `Settings` → `Pages`。
4. 在 `Build and deployment` 中选择 `Deploy from a branch`。
5. Branch 选择 `main` 和 `/ (root)`，然后点击 `Save`。
6. 等待约 1–3 分钟，GitHub 会显示网站链接。

如果仓库名是 `你的用户名.github.io`，网址通常是：

```text
https://你的用户名.github.io/
```

如果仓库使用其他名称，网址通常是：

```text
https://你的用户名.github.io/仓库名/
```

## 文件说明

- `index.html`：主页内容
- `styles.css`：页面设计和手机适配
- `script.js`：深色模式、移动端菜单和轻量动画
- `favicon.svg`：浏览器标签页图标
- `.nojekyll`：让 GitHub Pages 直接发布静态文件
