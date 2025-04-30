import yaml from "js-yaml";
import fs from "fs";
import path from "path";

const mainDoc = yaml.load(fs.readFileSync(path.resolve("docs/mainDoc.yaml"), "utf-8"));
const authDoc = yaml.load(fs.readFileSync(path.resolve("docs/authDoc.yaml"), "utf-8"));
const ownerDoc = yaml.load(fs.readFileSync(path.resolve("docs/ownerDoc.yaml"), "utf-8"));
const dishDoc = yaml.load(fs.readFileSync(path.resolve("docs/dishDoc.yaml"), "utf-8"));
const businessDoc = yaml.load(fs.readFileSync(path.resolve("docs/businessDoc.yaml"), "utf-8"));

const businessReviewDoc = yaml.load(
  fs.readFileSync(path.resolve("docs/businessReviewDoc.yaml"), "utf-8")
);

export const swaggerDocs = {
  ...mainDoc,
  paths: {
    ...authDoc.paths,
    ...ownerDoc.paths,
    ...dishDoc.paths,
    ...businessDoc.paths,
    ...businessReviewDoc.paths,
  },
  components: {
    ...(mainDoc.components || {}),
    schemas: {
      ...(mainDoc.components?.schemas || {}),
      ...(authDoc.components?.schemas || {}),
      ...(ownerDoc.components?.schemas || {}),
      ...(dishDoc.components?.schemas || {}),
      ...(businessDoc.components?.schemas || {}),
      ...(businessReviewDoc.components?.schemas || {}),
    },
  },
};
