import { equal } from "node:assert";
import { arch as ARCH, platform as PLATFORM } from "node:process";
import { resolve } from "node:path";
import { describe, it } from "node:test";

import nwbuild from "nw-builder";
import { By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";

import { ARCH_KV, PLATFORM_KV } from "../node_modules/nw-builder/src/util.js"

const { Driver, ServiceBuilder, Options } = chrome;

describe("test modes", async () => {
  let driver = undefined;

  let nwOptions = {
    srcDir: "test/app",
    mode: "get",
    version: "0.78.1",
    flavor: "sdk",
    platform: PLATFORM_KV[PLATFORM],
    arch: ARCH_KV[ARCH],
    cacheDir: "cache",
    glob: false,
  };

  it("should run", async () => {
    await nwbuild({ ...nwOptions });

    const options = new Options();
    const args = [
      `--nwapp=${resolve("test", "app")}`,
      "--headless=new",
    ];
    options.addArguments(args);

    const chromedriverPath = resolve(
      nwOptions.cacheDir,
      `nwjs${nwOptions.flavor === "sdk" ? "-sdk" : ""}-v${nwOptions.version}-${
        nwOptions.platform
      }-${nwOptions.arch}`,
      `chromedriver${nwOptions.platform === "win" ? ".exe" : ""}`,
    );

    const service = new ServiceBuilder(chromedriverPath).build();

    driver = Driver.createSession(options, service);
    const text = await driver.findElement(By.id("test")).getText();
    equal(text, "Hello, World!");
  });
});
