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
      "Javascript scaffolder is not supported currently, please use Typescript instead!",
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
          { name: "Overwrite", value: 1 },
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
  const downloadSpinner = ora("Start downlading template project...");
  const renameSpinner = ora("Renaming project...");
  downloadSpinner.start();
  const emitter = degit(repositoryUrl);
  await emitter
    .clone(targetDir)
    .then(() => {
      downloadSpinner.succeed(`${chalk.green("Downloading succeed.")}`);
      renameSpinner.start;
      const fileName = targetDir + "/package.json";
      if (fs.existsSync(fileName)) {
        const file = fs.readFileSync(fileName);
        let json = JSON.parse(file);
        json.name = name;
        fs.writeFile(
          fileName,
          JSON.stringify(json, null, 2),
          function writeJSON(err) {
            if (err) {
              renameSpinner.fail(
                `${chalk.red(`Rename project to ${name} failed.`)}`,
              );
              console.log("You can manually modify it in package.json latter.");
            } else {
              renameSpinner.succeed(
                `${chalk.green(`Rename project to ${name} successfully.`)}`,
              );
              console.log(`${chalk.green("Happy coding...")}`);
            }
          },
        );
      }
    })
    .catch((e) => {
      downloadSpinner.fail(`${chalk.red("Requst failed.")}`);
      console.log(e);
    });
};

program
  .name("design-pro")
  .description(
    "An awesome scaffloder width AntD, easily to use, supports JavaScript and TypeScript.",
  )
  .version(packageJson.version);

// 创建命令
program
  .command("create <name>")
  .alias("c")
  .description("Create an awesome project.")
  .action((name) => {
    figlet("design-pro").then(async (data) => {
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
        doCreate(action, name);
      }
    });
  });

program.parse();
