/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: UtilitiesAddCliToPath.ts
Created:  2024-02-10T03:23:02.782Z
Modified: 2024-02-10T03:23:02.782Z

Description: description
*/

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { readOnlyCliBinaryPath } from "../../../paths";
import ErrorResponse from "../../../responses/ErrorResponse";
import MessageResponse from "../../../responses/MessageResponse";
import which from "which";
import { execSync } from "child_process";

let UtilitiesAddCliToPath = async () => {
  return ErrorResponse.catchErrorsWithErrorResponse(async () => {
    const existingPathDefinition: string | null =
      which.sync("marchive-cli", { nothrow: true }) ??
      which.sync("marchive-cli.exe", { nothrow: true });

    if (existingPathDefinition != null) {
      return new MessageResponse(
        `The CLI tool is already in the system path in your shell terminal`,
        [{ path: existingPathDefinition }],
      );
    }

    const zshrcFilePath = `${os.homedir()}/.zshrc`;
    const addToPathOnZsh = () => {
      fs.appendFileSync(
        zshrcFilePath,
        `export PATH="${path.join(readOnlyCliBinaryPath, "..")}:$PATH"\n`,
      );
    };

    const bashrcFilePath = `${os.homedir()}/.bashrc`;
    const addToPathOnBash = () => {
      fs.appendFileSync(
        bashrcFilePath,
        `export PATH="${path.join(readOnlyCliBinaryPath, "..")}:$PATH"\n`,
      );
    };

    const addToPathOnWindows = () => {
      // TODO: Haven't actually tested this on Windows yet. It may need an elevated prompt. If it takes too long to get working, we can just add a message to the user to add the path manually on Windows.
      const powershellCommand = `powershell -Command "[Environment]::SetEnvironmentVariable('Path', [Environment]::GetEnvironmentVariable('Path', [System.EnvironmentVariableTarget]::Machine) + ';${path.join(readOnlyCliBinaryPath, "..")}', [System.EnvironmentVariableTarget]::Machine)"`;
      execSync(powershellCommand, { stdio: "inherit" });
    };

    const addToPath = () => {
      if (os.platform().startsWith("win")) {
        return addToPathOnWindows();
      } else if (os.platform() === "darwin") {
        if (fs.existsSync(zshrcFilePath)) addToPathOnZsh();
        if (fs.existsSync(bashrcFilePath)) return addToPathOnBash();

        return addToPathOnBash();
      } else if (os.platform() === "linux") {
        if (fs.existsSync(zshrcFilePath)) addToPathOnZsh();
        if (fs.existsSync(bashrcFilePath)) return addToPathOnBash();

        return addToPathOnBash();
      }
    };

    addToPath();

    return new MessageResponse(
      `The CLI tool has been added to the system path in your shell terminal`,
      [{ path: readOnlyCliBinaryPath }],
    );
  });
};

export default UtilitiesAddCliToPath;
