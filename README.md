<div align="center">

<img src="packages/electron-app/assets/icon.png" width="200" height="200"/>

<br>

# Marchive

The Ultimate Information, News and Media Archiver and Aggregator

<br>

</div>

## Install & Setup for Development

### Install Dependencies

Clone the repo and install dependencies:

```bash
git clone https://github.com/martinshaw/marchive.git marchive
cd marchive
pnpm install
```

### Setup the Development Environment

Run the `setup` script:

```bash
pnpm run setup
```

This will run the `setup` script in each of the packages using NX then it does the same for `compile` scripts.

In effect, this will install a copy of the latest Chromium browser for Puppeteer into the `data-providers` package, then it will compile the TypeScript code in each package into the respective `lib` directories.

### Build the `marchive-cli` Binary

To build the `marchive-cli` binary alongside its Chromium and native module dependencies:

```bash
pnpm run cli:pack:mac
```

This will build the `marchive-cli` binary for the macOS platform. If you are running on a different platform, you can replace `mac` with `linux` or `win` to build for the Linux or Windows platform respectively.

### Open the Electron App for Development

To open the Electron app for development, so that change to the code will result in a hot reload:

```bash
pnpm run electron-app:start
```

### Build and Package the Electron App for Production

To build and package the Electron app for the local platform:

```bash
pnpm run electron-app:package
```

## Monorepo Structure

The Marchive codebase is structured as a [monorepo](https://pnpm.io/workspaces) which separates areas of functionality, eliminate duplicated code and ensures that all functionality is available regardless of the type of process which is accessing the it (e.g. the renderer and main process under the Electron environment, and spawned / forked child processes, cross-process database setup and fast cross-process logging calls).

- [`packages/electron-app`](packages/electron-app) - The Electron app which provides the user interface and manages the app's main and renderer processes under the Electron environment.

- [`packages/database`](packages/database) - The database package which provides a cross-process database setup, migration, model classes, serialized model data types, and [Sequelize](https://github.com/sequelize/sequelize-typescript) ORM-related functionality.

- [`packages/logger`](packages/logger) - The logger package which provides a cross-process logging setup, log level functions, configuration, formatting, and rotation provided by the [Winston](https://github.com/winstonjs/winston) logging library.

- [`packages/utilities`](packages/utilities) - The utilities package which provides a cross-process convenience functions, types, and constants.

## Starting Development

Start the app in the `dev` environment:

```bash
pnpm run start
```

## Packaging for Production

To package apps for the local platform:

```bash
pnpm run package
```
