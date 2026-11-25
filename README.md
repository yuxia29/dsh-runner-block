# dsh-runner block

DeepSeek Harness Desktop `0.2.2-rc.5` 插件。点击输入区的模型按钮，即可用滑块调整推理档位、切换模型或操作当前会话的智能体团队。

## 安装

在 DSH 打开「插件」→「添加插件」，粘贴以下地址，点「安装」→「立即启用」。

```text
git+https://github.com/yuxia29/dsh-runner-block.git#v1.1.0
```

从 `v1.0.0` 或同名本地测试版升级时，先在 DSH 插件管理器移除旧版，再添加上面的 GitHub 版本。也可以在 [GitHub Release](https://github.com/yuxia29/dsh-runner-block/releases/tag/v1.1.0) 下载 `.tgz`，将其绝对路径填入「添加插件」。 [DSH rc.5 安装说明](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.5/packages/client/ui-plugin-manager/README.md#installing-a-bundle)

## 操作

- DeepSeek 模型提供 `Off`、`Low`、`High`、`Max` 四个节点，当前档位显示在滑轨上方。可点击节点或拖动，松手吸附到最近档位。其他模型沿用 DSH 提供的档位。
- 点击或拖动使滑钮到达 `Max` 节点时，粒子会爆发一次，并显示三秒蓝紫流动渐变的「消耗额度更快」。重新打开已选 `Max` 的面板只显示常驻粒子流。
- 点击模型名称进入选择界面。模型按账号、API、第三方提供商和自定义 API 分组，保留 DSH 提供的显示名称。来源分类缺失时仍按提供商名称展示可用模型。
- 左侧闪电切换本会话的智能体团队。右上角回转箭头切回原生样式，原生菜单中的「启用推理滑块」可再切回来。两个按钮的悬停提示显示在各自上方。

## 安全与隐私

安装包无额外依赖和安装脚本。插件只接受可信输入，提交前核对当前会话、可用模型和档位。面板关闭或切页后旧回调失效。窗口失焦、页面隐藏或会话锁定会取消在途拖动。团队停用沿用宿主确认。

界面只保留显示和操作所需字段。自定义模型与档位用显示名称呈现，内部 ID 不写入插件的 HTML 数据属性。插件没有独立联网、遥测、持久化或凭据读取入口。模型与档位通过 DSH 原生接口切换，宿主仍可能按自身设置记录这些操作。 [DSH 原生模型目录](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.5/packages/client/ui-model-selection/src/client/directory.ts#L90-L130)

## 许可证与来源

本项目采用 [MIT 许可证](LICENSE)。界面结构与插件清单参考 [DSH-Codex-reasoning-effort-slider](https://github.com/bakabaicai/DSH-Codex-reasoning-effort-slider/tree/f5315b56834db430dd5d879938f95b2792035594)，展开箭头路径来自 [DeepSeek Harness rc.5 原生图标](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.2-rc.5/packages/client/ui-primitives/src/icons/artwork.ts#L34-L38)。
