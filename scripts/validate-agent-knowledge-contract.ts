import { readFileSync, statSync } from "node:fs";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CORPUS_DIR = path.resolve(
  process.env.AGENT_KNOWLEDGE_CORPUS_DIR ||
    path.join(ROOT_DIR, "documentation/agent-migration/agent-knowledge"),
);
const SKILLS_DIR = path.resolve(process.env.AGENT_SKILLS_DIR || path.join(ROOT_DIR, "skills"));
const MANIFEST_PATH = path.join(CORPUS_DIR, "_export-manifest.json");

const CORPUS_REFERENCE_PREFIXES = [
  "memory-blocks/",
  "langage-clair/",
  "metadatas/",
  "conformite-editoriale/",
] as const;

type JsonRecord = Record<string, unknown>;

type ManifestResource = {
  originalFileName?: string;
  previousTargetPath?: string;
  sourcePath?: string;
  targetPath?: string;
};

type Manifest = {
  generatedFiles?: unknown[];
  resources?: unknown[];
};

const failures: string[] = [];

async function main(): Promise<void> {
  await assertDirectoryExists(CORPUS_DIR, "Corpus agent-knowledge introuvable");
  await assertDirectoryExists(SKILLS_DIR, "Dossier skills introuvable");

  validateManifest();
  await validateSkillReferences();

  if (failures.length > 0) {
    console.error("Contrat agent-knowledge invalide :");
    for (const failure of failures) {
      console.error(`- ${failure}`);
    }
    process.exit(1);
  }

  console.log("Contrat agent-knowledge valide.");
}

async function assertDirectoryExists(directoryPath: string, message: string): Promise<void> {
  try {
    const stats = await stat(directoryPath);
    if (!stats.isDirectory()) {
      failures.push(`${message} : ${directoryPath} n'est pas un dossier`);
    }
  } catch {
    failures.push(`${message} : ${directoryPath}`);
  }
}

function validateManifest(): void {
  const manifest = readJsonFile(MANIFEST_PATH) as Manifest;
  const generatedFiles = readStringArray(manifest.generatedFiles, "generatedFiles");
  const resources = readResourceArray(manifest.resources, "resources");
  const generatedFileSet = new Set(generatedFiles);

  for (const generatedFile of generatedFiles) {
    validateCorpusTargetPath(generatedFile, "generatedFiles");
  }

  for (const resource of resources) {
    if (!resource.targetPath) {
      failures.push("_export-manifest.json: une ressource n'a pas de targetPath");
      continue;
    }

    validateCorpusTargetPath(resource.targetPath, `resources.targetPath (${resource.targetPath})`);

    if (!generatedFileSet.has(resource.targetPath)) {
      failures.push(
        `_export-manifest.json: resources.targetPath absent de generatedFiles : ${resource.targetPath}`,
      );
    }

    validateNfc(resource.targetPath, `resources.targetPath (${resource.targetPath})`);
    validateOptionalNfc(
      resource.previousTargetPath,
      `resources.previousTargetPath (${resource.targetPath})`,
    );

    if (resource.previousTargetPath && resource.previousTargetPath === resource.targetPath) {
      failures.push(
        `_export-manifest.json: previousTargetPath identique au targetPath pour ${resource.targetPath}`,
      );
    }

    if (resource.sourcePath && resource.sourcePath === resource.targetPath) {
      failures.push(
        `_export-manifest.json: sourcePath ne doit pas remplacer la provenance Letta Cloud pour ${resource.targetPath}`,
      );
    }
  }
}

function readJsonFile(filePath: string): unknown {
  try {
    return JSON.parse(readFileSync(filePath, "utf8")) as unknown;
  } catch (error) {
    failures.push(`${filePath}: JSON invalide ou fichier illisible (${String(error)})`);
    return {};
  }
}

function readStringArray(value: unknown, label: string): string[] {
  if (!Array.isArray(value)) {
    failures.push(`_export-manifest.json: ${label} doit être un tableau`);
    return [];
  }

  return value.flatMap((item, index) => {
    if (typeof item !== "string") {
      failures.push(`_export-manifest.json: ${label}[${index}] doit être une chaîne`);
      return [];
    }
    return [item];
  });
}

function readResourceArray(value: unknown, label: string): ManifestResource[] {
  if (!Array.isArray(value)) {
    failures.push(`_export-manifest.json: ${label} doit être un tableau`);
    return [];
  }

  return value.flatMap((item, index) => {
    if (!isRecord(item)) {
      failures.push(`_export-manifest.json: ${label}[${index}] doit être un objet`);
      return [];
    }

    return [
      {
        originalFileName: readOptionalString(item.originalFileName),
        previousTargetPath: readOptionalString(item.previousTargetPath),
        sourcePath: readOptionalString(item.logicalPath),
        targetPath: readOptionalString(item.targetPath),
      },
    ];
  });
}

async function validateSkillReferences(): Promise<void> {
  const skillFiles = await findSkillFiles(SKILLS_DIR);

  for (const skillFile of skillFiles) {
    const skillContent = readFileSync(skillFile, "utf8");
    const references = extractCorpusReferences(skillContent);

    for (const reference of references) {
      validateNfc(reference, `${relativeToRoot(skillFile)}: référence corpus`);
      validateCorpusTargetPath(reference, `${relativeToRoot(skillFile)}: ${reference}`);
    }
  }
}

async function findSkillFiles(directoryPath: string): Promise<string[]> {
  const entries = await readdir(directoryPath, { withFileTypes: true });
  const skillFiles: string[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const skillFile = path.join(directoryPath, entry.name, "SKILL.md");
    try {
      const stats = await stat(skillFile);
      if (stats.isFile()) {
        skillFiles.push(skillFile);
      }
    } catch {
      failures.push(`${path.join("skills", entry.name)}: fichier SKILL.md introuvable`);
    }
  }

  return skillFiles.sort();
}

function extractCorpusReferences(content: string): string[] {
  const references = new Set<string>();
  const codeSpanRegex = /`([^`]+)`/g;
  let match: RegExpExecArray | null;

  while ((match = codeSpanRegex.exec(content)) !== null) {
    const reference = match[1];
    if (CORPUS_REFERENCE_PREFIXES.some((prefix) => reference.startsWith(prefix))) {
      references.add(reference);
    }
  }

  return [...references].sort();
}

function validateCorpusTargetPath(relativePath: string, context: string): void {
  validateNfc(relativePath, context);

  const absolutePath = path.resolve(CORPUS_DIR, relativePath);
  const relativeFromCorpus = path.relative(CORPUS_DIR, absolutePath);
  if (relativeFromCorpus.startsWith("..") || path.isAbsolute(relativeFromCorpus)) {
    failures.push(`${context}: chemin hors corpus refusé (${relativePath})`);
    return;
  }

  try {
    const stats = statSyncSafe(absolutePath);
    if (!stats?.isFile()) {
      failures.push(`${context}: fichier introuvable dans le corpus (${relativePath})`);
    }
  } catch {
    failures.push(`${context}: fichier introuvable dans le corpus (${relativePath})`);
  }
}

function statSyncSafe(filePath: string): ReturnType<typeof import("node:fs").statSync> | null {
  try {
    return statSync(filePath);
  } catch {
    return null;
  }
}

function validateOptionalNfc(value: string | undefined, context: string): void {
  if (value) {
    validateNfc(value, context);
  }
}

function validateNfc(value: string, context: string): void {
  if (value !== value.normalize("NFC")) {
    failures.push(`${context}: chemin non normalisé NFC (${value})`);
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function relativeToRoot(filePath: string): string {
  return path.relative(ROOT_DIR, filePath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
