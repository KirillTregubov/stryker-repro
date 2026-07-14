import path from "node:path";
import { fileURLToPath } from "node:url";
import { Stryker } from "@stryker-mutator/core";

const sampleRepoDirectory = path.resolve(import.meta.dirname, "..", "sample-repo");
const originalDirectory = process.cwd();

try {
  process.chdir(sampleRepoDirectory);

  const stryker = new Stryker({
    mutate: ["index.js"],
    testFiles: ["test/index.test.js"],
    testRunner: "mocha",
    plugins: ["@stryker-mutator/mocha-runner"],
    reporters: ["clear-text", "progress"],
    coverageAnalysis: "perTest",
    concurrency: 1,
    fileLogLevel: "trace",
  });

  const results = await stryker.runMutationTest();
  const killed = results.filter(({ status }) => status === "Killed").length;
  const survived = results.filter(({ status }) => status === "Survived").length;

  console.log(`Mutation testing complete: ${killed} killed, ${survived} survived.`);
} finally {
  process.chdir(originalDirectory);
}
