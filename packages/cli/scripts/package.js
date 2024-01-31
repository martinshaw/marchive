/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: package.js
Created:  2024-01-30T18:51:38.798Z
Modified: 2024-01-30T18:51:38.798Z

Description: A small build script I created to simplify the process of packing, building then cleaning up the preparatory directories used for `pkg` to build the binary
*/

const process = require("node:process");
const path = require("node:path");
const fs = require("node:fs");

if (process.argv.length < 4) {
  console.error(
    "Please provide the build platform and architecture as arguments (e.g. `node package-binary.js linux x64`)"
  );
  console.info(
    "Supported platforms: alpine, linux, linuxstatic, win, macos, (freebsd)"
  );
  console.info("Supported architectures: x64, arm64, (armv6, armv7)");
  process.exit(1);
}

/**
 * @type {alpine | linux | linuxstatic | win | macos | freebsd}
 */
const platform = process.argv[2];

if (
  !["alpine", "linux", "linuxstatic", "win", "macos", "freebsd"].includes(
    platform
  )
) {
  console.error(`Platform ${platform} is not supported`);
  console.info(
    "Supported platforms: alpine, linux, linuxstatic, win, macos, (freebsd)"
  );
  process.exit(1);
}

/**
 * @type {x64 | arm64 | armv6 | armv7}
 */
const arch = process.argv[3];

if (!["x64", "arm64", "armv6", "armv7"].includes(arch)) {
  console.error(`Architecture ${arch} is not supported`);
  console.info("Supported architectures: x64, arm64, (armv6, armv7)");
  process.exit(1);
}

// Get root of project packages
const rootPath = path.join(__dirname, "..", "..");
const cliPath = path.join(rootPath, "cli");
const dataProvidersPath = path.join(rootPath, "data-providers");

// Re-add the .gitkeep files to the lib directory after assumed Webpack compilation using `pnpm run compile`
if (fs.existsSync(path.join(cliPath, "lib")) !== true)
  fs.mkdirSync(path.join(cliPath, "lib"));
if (fs.existsSync(path.join(cliPath, "lib", ".gitkeep")) !== true)
  fs.writeFileSync(path.join(cliPath, "lib", ".gitkeep"), "");

// Clean up any previous builds
fs.readdirSync(path.resolve(cliPath, "bin")).forEach((file) => {
  if (file === ".gitkeep") return;
  fs.rmSync(path.join(cliPath, "bin", file), { recursive: true });
});

fs.readdirSync(path.resolve(cliPath, "pack")).forEach((file) => {
  if (["package.json", "package-lock.json", ".gitkeep"].includes(file)) return;
  fs.rmSync(path.join(cliPath, "pack", file), { recursive: true });
});

// Copy recently bundled script into pack directory
fs.copyFileSync(
  path.join(cliPath, "lib", "index.js"),
  path.join(cliPath, "pack", "index.js")
);

// Use shell to install packages using package.json in pack directory (npm install in cwd)
const { execSync } = require("child_process");
execSync("npm install", { cwd: path.join(cliPath, "pack") });

// Use shell to call `pkg` to build binary
execSync(
  /**
   * TODO: Solve error causing me to use `--public` flag and remove use of the `--public` flag
   * @see https://www.notion.so/martinshaw/Fix-Marchive-5ec25001ff4840959d53676e4f56ef65?pvs=4#866fe5f5c52b4f85bf815866802ff88d
   */
  `npx pkg . ` + `--targets node18-${platform}-${arch} --public`
  {
    cwd: path.join(cliPath, "pack"),
  }
);

// Copy Chromium binaries directory into bin directory to accompany binary (if missing)
if (fs.existsSync(path.join(cliPath, "bin", "chromium"))) {
  fs.rmdirSync(path.join(cliPath, "bin", "chromium"), { recursive: true });
}

const chromiumPath = path.join(dataProvidersPath, "chromium");

// Check if there are any Chromium installations in the chromium directory in the data providers package
let chromiumBinariesPath = fs
  .readdirSync(chromiumPath, {
    withFileTypes: true,
  })
  .filter((dirent) => dirent.isDirectory());

if (chromiumBinariesPath.length === 0) {
  console.warn(
    "No Chromium installations were found in the data providers package. Installing ..."
  );

  if (fs.existsSync(chromiumPath) !== true) fs.mkdirSync(chromiumPath);
  if (fs.existsSync(path.join(chromiumPath, ".gitkeep")) !== true)
    fs.writeFileSync(path.join(chromiumPath, ".gitkeep"), "");

  execSync("pnpm run chromium-install", { cwd: dataProvidersPath });

  chromiumBinariesPath = fs
    .readdirSync(chromiumPath, {
      withFileTypes: true,
    })
    .filter((dirent) => dirent.isDirectory());

  if (chromiumBinariesPath.length === 0) {
    console.error(
      "Tried to install Chromium but failed. Do it manually and try again."
    );
    process.exit(1);
  }
}

fs.cpSync(path.join(chromiumPath), path.join(cliPath, "bin", "chromium"), {
  recursive: true,
});

console.log(
  "Successfully built binary with bundled CLI script and SQLite native binaries. Copied Chromium binaries alongside in the bin directory."
);
console.log(path.join(cliPath, "bin"));
