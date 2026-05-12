# CLI to create an Ant Design project scaffold.

## Usage

### install with npm

`npm install @poppy_evil/design-pro -g`

### create a project

`design-pro create {project name}`  
or  
`design-pro c {project name}`  
or  
`dp create {project name}`  
or  
`dp c {project name}`

### choose language

JavaScript is not supported right now. Use TypeScript instead.
![choose_language](/screenshots/choose_language.png)

### happy coding

The CLI downloads the TypeScript template from `Evil-GitHub/evil-app`, renames the project in `package.json`, and then you are ready to code.
![happy_coding](/screenshots/happy_coding.png)

## Release / 发布

### 准备工作

- 确保你有 `@poppy_evil/design-pro` 的发布权限
- 登录 npm：`npm login`
- 建议工作区保持干净：`git status`

### 预演（推荐）

- 检查发布包内容：`npm pack --dry-run`
- 检查 CLI 版本与帮助：
  - `design-pro --version`
  - `design-pro --help`

### 发版

自动发包脚本会依次执行：

1. 检查 git 工作区是否干净
2. 运行 `npm test`
3. 运行 `npm pack --dry-run`
4. 执行 `npm version ...`
5. 执行 `npm publish`
6. 执行 `git push --follow-tags`

发补丁版本：

`npm run publish:patch`

发次版本：

`npm run publish:minor`

发主版本：

`npm run publish:major`

如果你的 npm 账号开启了发布 2FA（常见报错：需要 two-factor authentication / bypass 2fa token），需要提供一次性验证码（OTP）：

- `npm_config_otp=<your-otp-code> npm run publish:patch`
- `npm_config_otp=<your-otp-code> npm run publish:minor`
- `npm_config_otp=<your-otp-code> npm run publish:major`

旧命令仍可用：

- `npm run release:patch`
- `npm run release:minor`
- `npm run release:major`
