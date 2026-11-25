# dsh-runner block

DeepSeek Harness Desktop `0.2.2-rc.5` 插件。点击输入区的模型按钮，即可用滑块调整推理档位、切换模型或操作当前会话的智能体团队。

## 安装

在 DSH 打开「插件」→「添加插件」，粘贴以下地址，点「安装」→「立即启用」。

```text
git+https://github.com/yuxia29/dsh-runner-block.git#v1.0.0
```

如果已安装同名的本地测试版，先在 DSH 插件管理器移除旧版，再添加上面的 GitHub 版本。也可以在 [GitHub Release](https://github.com/yuxia29/dsh-runner-block/releases/tag/v1.0.0) 下载 `.tgz`，将其绝对路径填入「添加插件」。 [DSH rc.5 安装说明](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.5/packages/client/ui-plugin-manager/README.md#installing-a-bundle)

## 操作

- DeepSeek 模型展示 `Off`、`Low`、`High`、`Max`。可点四个节点或拖动，松手吸附到最近档位。其他模型按 DSH 提供的档位展示。
- 点击模型名称进入选择界面。模型按账号、API、第三方提供商和自定义 API 分组，名称来自 DSH 模型目录。
- 左侧闪电切换本会话的智能体团队。右上角回转箭头切回原生样式，原生菜单中的「启用推理滑块」可再切回来。

## 安全与权限

安装包无额外依赖和安装脚本。模型、档位和团队操作使用 DSH 会话接口。插件复核可信输入、会话资格与待处理状态，团队停用继续沿用宿主确认。提供商分类只保留当前目录需要的标记，插件无需访问 API 密钥或编辑软件配置。

## 许可证与来源

本项目采用 [MIT 许可证](LICENSE)。界面结构与插件清单参考 [DSH-Codex-reasoning-effort-slider](https://github.com/bakabaicai/DSH-Codex-reasoning-effort-slider/tree/f5315b56834db430dd5d879938f95b2792035594)，展开箭头路径来自 [DeepSeek Harness rc.5 原生图标](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.5/packages/client/ui-primitives/src/icons/artwork.ts#L34-L38)。
