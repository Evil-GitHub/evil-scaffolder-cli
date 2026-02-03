# cli to create an awesome project using AntDesign.

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

JS is not supported right now. Use Typescript instead.
![choose_language](/screenshots/choose_language.png)

### happy coding

The downloading will start, just wait a few seconds.
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

- 补丁版本：`npm run release:patch`
- 次版本：`npm run release:minor`
- 主版本：`npm run release:major`

如果你的 npm 账号开启了发布 2FA（常见报错：需要 two-factor authentication / bypass 2fa token），需要提供一次性验证码（OTP）：

- 一次性（不走脚本）：`npm publish --otp=123456`
- 走脚本：`npm_config_otp=123456 npm run release:patch`（minor/major 同理）

### 推送 tag

`npm version ...` 会在本地创建 git commit 与 tag。发布成功后需要推送到远端：

`git push --follow-tags`
