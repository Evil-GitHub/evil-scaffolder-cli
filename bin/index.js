#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import path from "path";
import degit from "degit";
import fs from "fs-extra";
import ora from "ora";
import figlet from "figlet";
import { fileURLToPath } from "url";

const program = new Command();

const packageJsonPath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "package.json",
);
const packageJson = fs.readJsonSync(packageJsonPath);

// 创建条件检查
const canCreate = async (action, name) => {
  // js 目前不支持，因为没有相应代码库
  if (action === 1) {
    console.log(
      "JavaScript scaffolder is not supported currently, please use TypeScript instead!",
    );
    return false;
  }
  const targetDir = path.join(process.cwd(), name);
  if (fs.existsSync(targetDir)) {
    const { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "Target directory already exists, pick an action:",
        choices: [
          { name: "Overwrite and delete existing directory", value: 1 },
          { name: "Cancel", value: -1 },
        ],
      },
    ]);

    if (action === -1) {
      console.log(
        `design-pro create project(${chalk.blueBright(`${name}`)}) is canceled.`,
      );
      return false;
    } else {
      await fs.remove(targetDir);
      return true;
    }
  } else {
    return true;
  }
};

// 创建工程
const doCreate = async (action, name) => {
  const repositoryUrl =
    action === 1 ? "" : "https://github.com/Evil-GitHub/evil-app.git";
  const targetDir = path.join(process.cwd(), name);
  const downloadSpinner = ora("Start downloading template project...");
  const renameSpinner = ora("Renaming project...");
  let downloaded = false;

  try {
    downloadSpinner.start();
    const emitter = degit(repositoryUrl);
    await emitter.clone(targetDir);
    downloaded = true;
    downloadSpinner.succeed(`${chalk.green("Downloading succeeded.")}`);

    const fileName = path.join(targetDir, "package.json");
    if (await fs.pathExists(fileName)) {
      renameSpinner.start();
      const json = await fs.readJson(fileName);
      json.name = name;
      await fs.writeJson(fileName, json, { spaces: 2 });
      renameSpinner.succeed(
        `${chalk.green(`Rename project to ${name} successfully.`)}`,
      );
    }

    console.log(`${chalk.green("Happy coding...")}`);
  } catch (e) {
    if (!downloaded) {
      downloadSpinner.fail(`${chalk.red("Request failed.")}`);
    }
    if (downloaded && renameSpinner.isSpinning) {
      renameSpinner.fail(`${chalk.red(`Rename project to ${name} failed.`)}`);
      console.log("You can manually modify it in package.json later.");
    }
    console.log(e);
    process.exitCode = 1;
  }
};

program
  .name("design-pro")
  .description(
    "An awesome scaffolder with AntD, easy to use, currently supports TypeScript.",
  )
  .version(packageJson.version);

// 创建命令
program
  .command("create <name>")
  .alias("c")
  .description("Create an awesome project.")
  .action(async (name) => {
    const data = await figlet("design-pro");
    console.log(chalk.blue(data));

    const { action } = await inquirer.prompt([
      {
        name: "action",
        type: "list",
        message: "Which script language do you want?",
        choices: [
          { name: "JavaScript", value: 1 },
          { name: "TypeScript", value: 2 },
        ],
      },
    ]);

    const ok = await canCreate(action, name);
    if (ok) {
      await doCreate(action, name);
    }
  });

program.parse();
