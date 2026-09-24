# Experience Compiler

将授权过滤后的 Work Experience Contract 编译为展示与交互所需的 Experience IR。TypeScript 实现，与 [coRoof Go Runtime](https://github.com/SolanZhang/coRoof) 通过 JSON 契约连接。

> pre-alpha。当前输出 IR；渲染器、交互状态、动作回传和连续重编译尚未实现。

## 开始开发

需要 Node.js 24+ 和 npm。在本仓库根目录运行：

```sh
npm ci
npm test
npm run demo
```

示例校验虚构合同审批契约，输出事实、风险、证据和动作。编译使用确定性规则，无 LLM、网络调用或企业凭据。高风险动作要求确认；不可用动作保留原因。IR 只是展示建议，不能授予权限或执行审批。

## 协议和测试

spec/ 保存共享 JSON Schema，examples/ 为虚构样例，src/generated/ 为生成的 TypeScript 类型。协议采用 v0.1 草案；$id 仅作标识，运行时读取本地 Schema。修改 Schema 后运行 npm run generate 并提交生成文件。

npm test 可以独立运行，不需要 Go 或 Core。跨仓库测试需要 Go 1.26+ 和 Core 检出：

```sh
npm run test:integration -- "../coRoof core"
```

Windows PowerShell 可通过环境变量传递含空格的路径：

```powershell
$env:COROOF_CORE_DIR = (Resolve-Path '../coRoof core').Path
npm run test:integration
```

该测试检查两端 Schema/样例一致，并验证 Go → JSON → TypeScript → IR。CI 固定 Core 提交以保证可复现；协议变更需同步 Core 快照并更新 CI 中的 ref。

编译器源码、Schema、生成类型和样例均为 [Apache-2.0](LICENSE)，版权说明见 [NOTICE](NOTICE)。
