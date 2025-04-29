import yaml from "js-yaml";
import fs from "fs";
import path from "path";

const mainDoc = yaml.load(fs.readFileSync(path.resolve("docs/mainDoc.yaml"), "utf-8"));
const authDoc = yaml.load(fs.readFileSync(path.resolve("docs/authDoc.yaml"), "utf-8"));
const ownerDoc = yaml.load(fs.readFileSync(path.resolve("docs/ownerDoc.yaml"), "utf-8"));

export const swaggerDocs = {
  ...mainDoc,
  paths: {
    ...authDoc.paths,
    ...ownerDoc.paths,
  },
  components: {
    ...(mainDoc.components || {}),
    schemas: {
      ...(mainDoc.components?.schemas || {}),
      ...(authDoc.components?.schemas || {}),
      ...(ownerDoc.components?.schemas || {}),
    },
  },
};
