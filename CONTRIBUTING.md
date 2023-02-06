## Contributing to Qwik

Thank you for taking an interest in contributing to Qwik! We appreciate you! 🫶🏽

Below are the guidelines on how to help in the best possible way.

### Submitting an Issue

Before creating a new issue, please search through open issues using the [GitHub issue search bar](https://docs.github.com/en/issues/tracking-your-work-with-issues/filtering-and-searching-issues-and-pull-requests). You might find the solution to your problem, or can verify that it is an already known issue.

We want a bug-free and best-performing project. That's why we take all reported issues to heart. But please be aware that if we can't reproduce the problem, we won't have a way of locating and adequately fixing it.

Therefore, to solve the problem in the best possible way, please create a minimal repository that reproduces the problem with the least possible code explaining and demonstrating the error.

Without enough information to reproduce the issue, we will close it because we can't recreate and solve it.

### Submitting a Pull Request (PR)

#### Branch Organization

We adopt [trunk-based development](https://trunkbaseddevelopment.com/) therefore all Pull Requests are made against the main branch because we do not use separate branches for development or for the versions we release.

#### Good first issue

The issues marked with [_Good first issue_](https://github.com/BuilderIO/qwik/issues?q=is:open+is:issue+label:%22good+first+issue%22) are a good starting point to familiarize yourself with the project.

Before solving the problem, please check with the maintainers that the issue is still relevant. Feel free to leave a comment on the issue to show your intention to work on it and prevent other people from unintentionally duplicating your effort.

#### Sending a Pull Request

Before submitting a pull request, consider the following guidelines:

- Fork the repository into your own account.
- In your forked repository, create a new branch: `git checkout -b my-branch main`
- Make your changes/fixes.
- Run `pnpm fmt` to lint the code.
- Commit your code with a good commit message [using "Commitizen"](#committing-using-commitizen).
- Push your branch to GitHub: `git push origin my-branch`
- In GitHub, send a pull request to `BuilderIO:main`.

> If you aren't sure your PR is ready, open it as a [draft](https://github.blog/2019-02-14-introducing-draft-pull-requests/) to make it clear to the maintainer.

# Getting started

There are several ways to set up your local environment so that you are ready to build, test and contribute to the Qwik project.

## The recommended way

This is the best approach because all required dependencies will be installed in the docker container for you and won't affect your personal configuration in any way.

#### Prerequisites

You need to have these tools up and running in your local machine:

- [VSCode](https://code.visualstudio.com/)
- [Docker](https://www.docker.com/)

#### Steps

- Install the [Remote Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) extension in your VSCode.
- Once installed you will be prompted to reopen the folder in a container. If you're not prompted, you can run the `Remote-Containers: Open Folder in Container` command from the [VSCode Command Palette](https://code.visualstudio.com/docs/getstarted/userinterface#_command-palette).

## Alternative way

If you're not able to use the dev container, follow these instructions:

## Installation

> These are for a full build that includes Rust binaries.

1. Make sure [Rust](https://www.rust-lang.org/tools/install) is installed.
2. Install [wasm-pack](https://rustwasm.github.io/wasm-pack/installer/) with `cargo install wasm-pack` .
3. Node version >= `16.8.0`.
4. Make sure you have [pnpm](https://pnpm.io/installation) installed.
5. run `pnpm install`

> On Windows, Rust requires [C++ build tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/). You can also select _Desktop development with C++_
> while installing Visual Studio.

> Alternatively, if Rust is not available you can run `pnpm build.platform.copy` to download bindings from CDN

---

## Development

To build Qwik for local development, install the dev dependencies using [pnpm](https://pnpm.io/):

```shell
pnpm install
```

### Fast build

It will build all JS and all packages, but not Rust.

```shell
pnpm build
```

### Full build

It will build **everything**, including Rust packages and WASM.

> First build might be very slow.

- Builds each submodule
- Generates bundled `.d.ts` files for each submodule with [API Extractor](https://api-extractor.com/)
- Checks the public API hasn't changed
- Builds a minified `core.min.mjs` file
- Generates the publishing `package.json`

```shell
pnpm build.full
```

The build output will be written to `packages/qwik/dist`, which will be the directory that is published to [@builder.io/qwik](https://www.npmjs.com/package/@builder.io/qwik).

### Run in your own app:

Say you made changes to the repo. After you finished you'd need to run the build command (`pnpm build.full`/`pnpm build`).

To use your build in your project, follow these steps:

1. Inside the root of the `qwik` project run:

   ```shell
   pnpm link.dist
   ```

2. Inside the root of your project run:

   ```shell
   npm install
   npm link @builder.io/qwik @builder.io/qwik-city
   ```

   or

   ```shell
    pnpm install
    pnpm link --global @builder.io/qwik @builder.io/qwik-city
   ```

If you can't use package linking (npm link) just copy the contents of `package/qwik/dist` into your projects' `node_modules/@builder.io/qwik` folder.

### Test against the docs site:

1. Go to `packages/docs/package.json` and update:

   ```diff

   -- "@builder.io/qwik": "0.17.4",
   -- "@builder.io/qwik-city": "0.1.0-beta13",

   ++ "@builder.io/qwik": "workspace:*",
   ++ "@builder.io/qwik-city": "workspace:*",
   ```

2. At the root of the Qwik repo folder run:

```shell
pnpm install
```

3. Run the docs site:

```shell
cd packages/docs && pnpm start
```

### To open the test apps for debugging run:

```shell
pnpm serve
```

### Unit Tests Only

Unit tests use [uvu](https://github.com/lukeed/uvu)

```shell
pnpm test.unit
```

To keep _uvu_ open with the watch mode, run:

```shell
pnpm test.watch
```

> Note that the `test.watch` command isn't necessary if you're running the `pnpm start` command, since `start` will also concurrently run the _uvu_ watch process.

### E2E Tests Only

E2E tests use [Playwright](https://playwright.dev/).

To run the Playwright tests headless, from start to finish, run:

```shell
pnpm test.e2e.chromium
```

Finally, you can use `pnpm --filter` command to run packages' commands, for example:

```shell
pnpm --filter qwik-docs start
```

More commands can be found in each package's package.json scripts section.

## Starter CLI `create-qwik`

- [Starter CLI](https://github.com/BuilderIO/qwik/blob/main/starters/README.md)

## Pull Request

- [Open Qwik in Stackblitz Codeflow](https://pr.new/github.com/BuilderIO/qwik/)
- Review PR in Stackblitz
  ![image](https://user-images.githubusercontent.com/4918140/195581745-8dfca1f9-2dcd-4f6a-b7aa-705f3627f8fa.png)

### Committing using "Commitizen":

Instead of using `git commit` please use the following command:

```shell
pnpm commit
```

You'll be asked guiding questions which will eventually create a descriptive commit message and necessary to generate meaningful release notes / CHANGELOG automatically.

### Pre-submit hooks

The project has pre-submit hooks, which ensure that your code is correctly formatted. You can run them manually like so:

```shell
pnpm lint
```

Some issues can be fixed automatically by using:

```shell
pnpm fmt
```

## Releasing (core-team only)

1. Run `pnpm release.prepare`, which will test, lint and build.
2. Use the interactive UI to select the next version, which will update the `package.json` `version` property, add the git change, and start a commit message.
3. Create a PR with the `package.json` change to merge to `main`.
4. After the `package.json` with the updated version is in `main`, click the [Run Workflow](https://github.com/BuilderIO/qwik/actions/workflows/ci.yml) button from the "Qwik CI" GitHub Action workflow.
5. Select the NPM dist-tag that should be used for this version, then click "Run Workflow".
6. The GitHub Action will dispatch the workflow to build `@builder.io/qwik` and each of the submodules, build WASM and native bindings, combine them into one package, and validate the package before publishing to NPM.
7. If the build is successful and all tests and validation passes, the workflow will automatically publish to NPM, commit a git tag to the repo, and create a GitHub release.
8. 🚀
