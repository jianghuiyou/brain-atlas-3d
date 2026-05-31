# Brain Atlas 3D

一个可在本地浏览器运行的交互式 3D 人脑学习图谱。项目使用 `React`、`Three.js` 和 `Vite` 构建，支持旋转、缩放、点击脑区、自动聚焦、高亮显示，并在侧边知识区展示脑区位置、功能、系统连接、情绪与神经化学说明以及资料来源。

> 本项目用于教育学习，不是医学诊断工具，也不是临床级解剖模型。

## 在线体验
https://jianghuiyou.github.io/brain-atlas-3d/
## 功能特性

- 3D 交互：拖拽旋转、滚轮缩放、点击脑区、自动聚焦、高亮和重置视角。
- 层级目录：按大脑/端脑、间脑、脑干、小脑等宏观神经解剖结构组织。
- 脑叶关系：额叶、顶叶、颞叶、枕叶作为大脑皮层脑叶；前额叶作为额叶子区域展示。
- 深部结构：包含丘脑、下丘脑、海马体、杏仁核、胼胝体等教学定位和说明。
- 知识面板：补充功能概览、系统连接、情绪与神经化学、学习提示和外部参考资料。
- 对应精度：每个脑区标注当前 3D 模型中的 mesh 对应可靠程度。
- 本地运行：无需后端服务，安装依赖后即可在浏览器中使用。

## 技术栈

- `Vite`
- `React`
- `TypeScript`
- `Three.js`
- `@react-three/fiber`
- `@react-three/drei`

## 环境要求

- `Node.js` 20 或更高版本
- `npm`，随 Node.js 一起安装
- `Git`，用于克隆仓库
- 支持 WebGL 的现代浏览器，例如 Chrome、Edge、Firefox 或 Safari

检查本机版本：

```bash
node -v
npm -v
git --version
```

下载地址：

- Node.js: https://nodejs.org/
- Git: https://git-scm.com/downloads

## 快速开始

GitHub 仓库地址：

https://github.com/jianghuiyou/brain-atlas-3d

### macOS / Linux

```bash
git clone https://github.com/jianghuiyou/brain-atlas-3d.git
cd brain-atlas-3d
npm install
npm run download:brain-glb
npm run dev
```

### Windows

在 `PowerShell` 或 `Windows Terminal` 中执行：

```powershell
git clone https://github.com/jianghuiyou/brain-atlas-3d.git
cd brain-atlas-3d
npm install
npm run download:brain-glb
npm run dev
```

启动后，在浏览器打开终端显示的地址，通常是：

```text
http://localhost:5173/
```

## 不使用 Git 下载

也可以在 GitHub 页面点击 `Code` -> `Download ZIP` 下载源码。解压后进入项目目录，执行：

```bash
npm install
npm run download:brain-glb
npm run dev
```

## 常用命令

启动开发服务器：

```bash
npm run dev
```

生成本地 `GLB` 大脑 atlas 模型：

```bash
npm run download:brain-glb
```

尝试下载 NIH HRA/Allen STL 备用模型：

```bash
npm run download:nih-brain
```

构建生产版本：

```bash
npm run build
```

本地预览生产构建：

```bash
npm run preview
```

运行代码检查：

```bash
npm run lint
```

## 公网部署

本项目已提供 GitHub Pages 自动部署配置：

```text
.github/workflows/deploy.yml
```

部署流程：

- 推送代码到 `main` 分支。
- GitHub Actions 自动执行 `npm ci`。
- 自动执行 `npm run download:brain-glb` 生成真实大脑 `GLB` 模型。
- 自动执行 `npm run build` 构建静态站点。
- 自动发布 `dist/` 到 GitHub Pages。

首次启用时，需要在仓库页面进入 `Settings` -> `Pages`，将 `Source` 设置为 `GitHub Actions`。

Vite 在 GitHub Pages 构建时会使用 `/brain-atlas-3d/` 作为资源基础路径；本地开发仍使用 `/`，不影响 `localhost` 运行。

## 3D 模型说明

项目推荐使用浏览器友好的本地 `GLB` atlas。运行以下命令后会生成模型文件：

```bash
npm run download:brain-glb
```

生成路径：

```text
public/models/brain-atlas.glb
```

模型加载优先级：

```text
brain-atlas.glb -> nih-hra-allen-brain.stl -> 程序化教学兜底模型
```

`brain-atlas.glb` 是本地生成的大文件，默认不提交到 GitHub。其他用户克隆仓库后运行 `npm run download:brain-glb` 即可生成。

## 脑区分类方式

本项目采用适合入门学习的宏观神经解剖层级：

- 大脑 / 端脑：包括左右大脑半球、大脑皮层脑叶、内侧颞叶相关结构和胼胝体。
- 大脑皮层脑叶：额叶、顶叶、颞叶、枕叶；前额叶作为额叶子区域展示。
- 间脑：包括丘脑和下丘脑等位于端脑与脑干之间的结构。
- 脑干：当前显示整体脑干，未细分中脑、脑桥和延髓。
- 小脑：当前显示整体小脑，未细分小脑叶或小脑核。

这种分类用于教学导航，不等同于完整临床脑图谱。真实神经解剖还可以按胚胎发育、灰质/白质、皮层/皮层下、功能网络、核团和纤维束等多种方式分类。

## 教育用途说明

本应用不能用于：

- 医学诊断
- 临床决策
- MRI 级个体解剖定位
- 完整脑图谱 atlas 分割

页面中的 `3D 对应` 会说明每个脑区在当前模型中的可靠程度。部分结构有独立 mesh，部分结构只有近似/局部映射，少数结构只有教学定位标记。

## GitHub 仓库准备说明

推荐仓库名：`brain-atlas-3d`。

建议提交到 GitHub 的内容：

- `src/` 源码
- `scripts/` 模型下载与生成脚本
- `public/models/model-manifest.json`
- `README.md`
- `package.json` 和 `package-lock.json`
- `.gitignore`、`eslint.config.js`、`tsconfig*.json`、`vite.config.ts`

默认不提交的内容：

- `node_modules/`
- `dist/`
- `.cache/`
- `public/models/brain-atlas.glb`
- `public/models/*.stl`、`*.obj`、`*.gltf`、`*.bin` 等生成或下载的模型资产
- `.env` 和其他本地环境文件

## 资料来源

脑区解释和分类参考以下公开资料，并在页面中保留来源链接：

- NINDS Brain Basics: Know Your Brain  
  https://www.ninds.nih.gov/health-information/patient-caregiver-education/brain-basics-know-your-brain
- Johns Hopkins Medicine: Brain Anatomy and How the Brain Works  
  https://www.hopkinsmedicine.org/health/conditions-and-diseases/anatomy-of-the-brain
- NCBI Bookshelf: Anatomy, Central Nervous System  
  https://www.ncbi.nlm.nih.gov/books/NBK542179/
- University of Texas Medical School: Introduction - Overview of the Nervous System  
  https://nba.uth.tmc.edu/neuroanatomy/introduction.html
- NIH 3D: Brain, Male / HRA Allen brain model  
  https://3d.nih.gov/entries/20960/1
- 3D Reference Organ for Brain, Male v1.3  
  https://doi.org/10.48539/HBM929.XKCL.339
- Brainder.org: Brain for Blender  
  https://brainder.org/research/brain-for-blender/
- freesurfer-to-glb  
  https://www.npmjs.com/package/freesurfer-to-glb

## 授权和引用

请在公开仓库中保留第三方模型与资料来源说明。

- `freesurfer-to-glb` 代码标注为 `Apache-2.0`。
- Brainder.org `Brain for Blender` 网格数据标注为 `CC BY-SA 3.0`。
- NIH 3D `Brain, Male` 页面标注为 `CC BY 4.0`。

如果你为项目添加自己的开源许可证，请确认它与第三方模型数据的授权兼容。

## 常见问题

如果页面里没有真实大脑模型：

```bash
npm run download:brain-glb
npm run dev
```

如果端口 `5173` 被占用：

```bash
npm run dev -- --port 5174
```

如果浏览器显示 WebGL 不可用：

- 更新浏览器到最新版本。
- 确认没有禁用硬件加速。
- 尝试 Chrome、Edge、Firefox 或 Safari。

如果 `npm install` 失败：

- 确认 Node.js 版本为 20 或更高。
- 删除 `node_modules` 后重新执行 `npm install`。

## 后续扩展

- 导入更高精度且授权清晰的 `GLTF` 或 `OBJ` 人脑模型。
- 增加更细粒度的脑区、核团和白质束标注。
- 增加脑干细分：中脑、脑桥、延髓。
- 增加小脑细分：小脑叶、小脑核。
- 增加中英双语标签。
- 增加引导式学习路线和测验模式。
