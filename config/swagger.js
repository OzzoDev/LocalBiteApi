import yaml from "js-yaml";
import fs from "fs";
import path from "path";

const mainDoc = yaml.load(fs.readFileSync(path.resolve("docs/mainDoc.yaml"), "utf-8"));

export const swaggerDocs = {
  ...mainDoc,
  paths: {},
};
