import { config } from "dotenv";
import { mkdir, readFile, rm, writeFile } from "fs/promises";
import path from "path";

config({ quiet: true });

const DEFAULT_BASE_URL = "https://api.letta.com";
const DEFAULT_OUTPUT_DIR = "documentation/agent-migration/agent-knowledge";
const MANIFEST_FILE_NAME = "_export-manifest.json";

const SOURCE_FOLDER_MAP: Record<string, string> = {
  ressources_langage_clair: "langage-clair",
  ressources_exemples_redaction: "exemples-redaction",
  ressources_metadatas: "metadatas",
  ressources_conformité_éditoriale: "conformite-editoriale",
};

const DEFAULT_EXCLUDED_SOURCE_NAMES = new Set(["ressources_exemples_redaction"]);
const DEFAULT_EXCLUSION_REASON = "source retirée du corpus cible après revue qualité";

const CONTENT_REDACTIONS: Array<[RegExp, string]> = [
  [/graines-solidarite@hotmail\.fr/gi, "contact@example.org"],
  [/0617027400/g, "06 XX XX XX XX"],
  [/apicquenot@simplon\.co/gi, "contact@example.org"],
];

const TEXT_EXTENSIONS = new Set([".csv", ".json", ".md", ".txt", ".yaml", ".yml"]);

type JsonRecord = Record<string, unknown>;

type CliOptions = {
  baseUrl: string;
  dryRun: boolean;
  fromFile?: string;
  outputDir: string;
};

type ExportedResource = {
  chunksEmbedded?: number;
  content?: string;
  errorMessage?: string;
  fileId: string;
  fileName: string;
  fileSize?: number;
  fileType?: string;
  logicalPath: string;
  originalFileName?: string;
  processingStatus?: string;
  sourceId?: string;
  sourceName?: string;
  targetPath: string;
  totalChunks?: number;
  weakExtractionReasons: string[];
};

type ExcludedResource = Omit<ExportedResource, "content"> & {
  exclusionReason: string;
};

type ExportManifest = {
  agentId: string;
  api: string;
  generatedAt: string;
  generatedFiles: string[];
  excludedResources: ExcludedResource[];
  resources: ExportedResource[];
  summary: {
    chunksEmbedded: number;
    excludedFiles: number;
    files: number;
    missingContent: number;
    totalChunks: number;
    weakExtractionWarnings: number;
  };
};

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    baseUrl: process.env.PLAYGROUND_LETTA_BASE_URL || DEFAULT_BASE_URL,
    dryRun: false,
    outputDir: DEFAULT_OUTPUT_DIR,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      options.dryRun = true;
      continue;
    }

    if (arg === "--from-file") {
      options.fromFile = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }

    if (arg === "--output-dir") {
      options.outputDir = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }

    if (arg === "--base-url") {
      options.baseUrl = readRequiredArg(argv, index, arg);
      index += 1;
      continue;
    }

    if (arg === "--help" || arg === "-h") {
      printUsage();
      process.exit(0);
    }

    throw new Error(`Argument inconnu : ${arg}`);
  }

  return options;
}

function readRequiredArg(argv: string[], index: number, flag: string): string {
  const value = argv[index + 1];
  if (!value || value.startsWith("--")) {
    throw new Error(`Valeur manquante pour ${flag}`);
  }
  return value;
}

function printUsage(): void {
  console.log(`Usage : pnpm agent-knowledge:export [options]

Exporte les fichiers indexés Letta Cloud d'Agathe via la sortie compatible client.agents.exportFile.

Variables d'environnement :
  PLAYGROUND_LETTA_API_KEY   Requise sauf avec --from-file.
  PLAYGROUND_AGENT_ID        Requise sauf avec --from-file.
  PLAYGROUND_LETTA_BASE_URL  Optionnelle. Vaut ${DEFAULT_BASE_URL} par défaut.

Options :
  --dry-run                  Récupère et normalise les ressources sans écrire de fichier.
  --from-file <path>         Normalise un export JSON existant sans appeler Letta.
  --output-dir <path>        Dossier de sortie. Vaut ${DEFAULT_OUTPUT_DIR} par défaut.
  --base-url <url>           Surcharge l'URL de base de l'API Letta pour cette exécution.

Note : la source ressources_exemples_redaction est exclue par défaut du corpus cible.
`);
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const exportedAt = new Date().toISOString();
  const agentId = options.fromFile ? "local-export-file" : readPlaygroundEnv("PLAYGROUND_AGENT_ID");
  const agentExport = options.fromFile
    ? await readExportFile(options.fromFile)
    : await fetchAgentExport(
        options.baseUrl,
        agentId,
        readPlaygroundEnv("PLAYGROUND_LETTA_API_KEY"),
      );

  const { excludedResources, resources } = excludeResources(normalizeResources(agentExport));
  const outputDir = path.resolve(options.outputDir);
  const generatedFiles = await writeResources({
    dryRun: options.dryRun,
    exportedAt,
    outputDir,
    resources,
  });

  const manifest = buildManifest({
    agentId,
    exportedAt,
    excludedResources,
    generatedFiles,
    resources,
  });

  if (!options.dryRun) {
    await writeFile(
      path.join(outputDir, MANIFEST_FILE_NAME),
      formatRepositoryJson(manifest),
      "utf8",
    );
  }

  printSummary(manifest, options.dryRun);
}

function readPlaygroundEnv(name: "PLAYGROUND_AGENT_ID" | "PLAYGROUND_LETTA_API_KEY"): string {
  const value = process.env[name];
  if (!value) {
    const forbiddenFallback =
      name === "PLAYGROUND_LETTA_API_KEY" ? "LETTA_API_KEY" : "LETTA_PROJECT_ID";
    throw new Error(
      `${name} est requis. Cette migration ne lit volontairement pas ${forbiddenFallback} ; ` +
        "configurez plutôt la variable PLAYGROUND_*.",
    );
  }
  return value;
}

async function readExportFile(filePath: string): Promise<JsonRecord> {
  const content = await readFile(filePath, "utf8");
  const parsed = JSON.parse(content) as unknown;
  if (!isRecord(parsed)) {
    throw new Error(`Le fichier d'export ${filePath} ne contient pas d'objet JSON`);
  }
  return parsed;
}

async function fetchAgentExport(
  baseUrl: string,
  agentId: string,
  apiKey: string,
): Promise<JsonRecord> {
  const normalizedBaseUrl = baseUrl.replace(/\/$/, "");
  const url = `${normalizedBaseUrl}/v1/agents/${encodeURIComponent(agentId)}/export`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(
      `L'export Letta a échoué avec HTTP ${response.status} ${response.statusText}: ${body.slice(0, 500)}`,
    );
  }

  const parsed = JSON.parse(body) as unknown;
  if (!isRecord(parsed)) {
    throw new Error("La réponse d'export Letta n'est pas un objet JSON");
  }
  return parsed;
}

function normalizeResources(agentExport: JsonRecord): ExportedResource[] {
  const files = readArray(agentExport.files, "files");
  const sources = Array.isArray(agentExport.sources)
    ? agentExport.sources
    : readArray(agentExport.folders, "sources");
  const sourcesById = new Map(
    sources.filter(isRecord).map((source) => [readOptionalString(source.id), source] as const),
  );

  const seenTargets = new Map<string, number>();

  return files.filter(isRecord).map((file, index) => {
    const sourceId = readOptionalString(file.source_id) || readOptionalString(file.folder_id);
    const source = sourceId ? sourcesById.get(sourceId) : undefined;
    const sourceName = source
      ? readOptionalString(source.name) || readOptionalString(source.folder_name)
      : undefined;
    const fileName =
      readOptionalString(file.file_name) ||
      readOptionalString(file.original_file_name) ||
      `letta-exported-file-${index + 1}`;
    const logicalPath = deriveLogicalPath(file, fileName, sourceName);
    const fileType = readOptionalString(file.file_type);
    const originalExtension = path.extname(fileName || logicalPath).toLowerCase();
    const targetPath = dedupeTargetPath(
      toTargetPath(logicalPath, fileName, fileType, originalExtension),
      seenTargets,
    );
    const totalChunks = readOptionalNumber(file.total_chunks);
    const chunksEmbedded = readOptionalNumber(file.chunks_embedded);
    const content = readOptionalString(file.content);
    const processingStatus = readOptionalString(file.processing_status);
    const errorMessage = readOptionalString(file.error_message);
    const weakExtractionReasons = getWeakExtractionReasons({
      chunksEmbedded,
      content,
      errorMessage,
      fileType,
      originalExtension,
      processingStatus,
      totalChunks,
    });

    return {
      chunksEmbedded,
      content,
      errorMessage,
      fileId: readOptionalString(file.id) || `file-${index}`,
      fileName,
      fileSize: readOptionalNumber(file.file_size),
      fileType,
      logicalPath,
      originalFileName: readOptionalString(file.original_file_name),
      processingStatus,
      sourceId,
      sourceName,
      targetPath,
      totalChunks,
      weakExtractionReasons,
    };
  });
}

function excludeResources(resources: ExportedResource[]): {
  excludedResources: ExcludedResource[];
  resources: ExportedResource[];
} {
  const includedResources: ExportedResource[] = [];
  const excludedResources: ExcludedResource[] = [];

  for (const resource of resources) {
    if (resource.sourceName && DEFAULT_EXCLUDED_SOURCE_NAMES.has(resource.sourceName)) {
      const { content: _content, ...resourceWithoutContent } = resource;
      excludedResources.push({
        ...resourceWithoutContent,
        exclusionReason: DEFAULT_EXCLUSION_REASON,
      });
      continue;
    }

    includedResources.push(resource);
  }

  return { excludedResources, resources: includedResources };
}

function deriveLogicalPath(file: JsonRecord, fileName: string, sourceName?: string): string {
  const exportedPath = readOptionalString(file.file_path);
  if (exportedPath) {
    return normalizeSlashes(exportedPath);
  }

  if (sourceName) {
    return normalizeSlashes(`${sourceName}/${fileName}`);
  }

  return normalizeSlashes(fileName);
}

function toTargetPath(
  logicalPath: string,
  fileName: string,
  fileType: string | undefined,
  originalExtension: string,
): string {
  const safeLogicalPath = makeSafeRelativePath(logicalPath);
  const segments = safeLogicalPath.split("/");
  const sourceFolder = segments[0];
  const normalizedSourceFolder = sourceFolder.normalize("NFC");
  const mappedSourceFolder =
    SOURCE_FOLDER_MAP[normalizedSourceFolder] || slugifyPathSegment(sourceFolder);
  const rawRelativeSegments =
    segments.length > 1 ? segments.slice(1) : [makeSafePathSegment(fileName)];
  const relativeSegments =
    rawRelativeSegments[0] === sourceFolder ? rawRelativeSegments.slice(1) : rawRelativeSegments;
  const normalizedSegments = [mappedSourceFolder, ...relativeSegments];
  const normalizedPath = normalizedSegments.join("/");

  if (isPdf(fileType, originalExtension)) {
    return replaceExtension(normalizedPath, ".md");
  }

  if (TEXT_EXTENSIONS.has(originalExtension)) {
    return normalizedPath;
  }

  return replaceExtension(normalizedPath, ".md");
}

function makeSafeRelativePath(value: string): string {
  const segments = normalizeSlashes(value).split("/").filter(Boolean).map(makeSafePathSegment);

  if (segments.length === 0) {
    throw new Error(`Chemin vide invalide dans le chemin exporté : ${value}`);
  }

  return segments.join("/");
}

function makeSafePathSegment(value: string): string {
  const cleaned = value.replace(/\0/g, "").trim();
  if (!cleaned || cleaned === "." || cleaned === "..") {
    return "_";
  }
  return cleaned.replace(/[/\\]/g, "-");
}

function slugifyPathSegment(value: string): string {
  return (
    makeSafePathSegment(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "autres"
  );
}

function normalizeSlashes(value: string): string {
  return value.replace(/\\/g, "/").replace(/^\/+/, "");
}

function replaceExtension(value: string, extension: string): string {
  const currentExtension = path.extname(value);
  if (!currentExtension) {
    return `${value}${extension}`;
  }
  return `${value.slice(0, -currentExtension.length)}${extension}`;
}

function dedupeTargetPath(targetPath: string, seenTargets: Map<string, number>): string {
  if (!seenTargets.has(targetPath)) {
    seenTargets.set(targetPath, 1);
    return targetPath;
  }

  const extension = path.extname(targetPath);
  const withoutExtension = extension ? targetPath.slice(0, -extension.length) : targetPath;
  let counter = (seenTargets.get(targetPath) || 1) + 1;

  while (true) {
    const candidate = `${withoutExtension}-${counter}${extension}`;
    if (!seenTargets.has(candidate)) {
      seenTargets.set(targetPath, counter);
      seenTargets.set(candidate, 1);
      return candidate;
    }

    counter += 1;
  }
}

function getWeakExtractionReasons(input: {
  chunksEmbedded?: number;
  content?: string;
  errorMessage?: string;
  fileType?: string;
  originalExtension: string;
  processingStatus?: string;
  totalChunks?: number;
}): string[] {
  const reasons: string[] = [];

  if (!input.content?.trim()) {
    reasons.push("contenu extrait vide ou absent");
  }

  if (input.processingStatus && input.processingStatus !== "completed") {
    reasons.push(`statut de traitement ${input.processingStatus}`);
  }

  if (input.errorMessage) {
    reasons.push(`erreur Letta: ${input.errorMessage}`);
  }

  if (
    typeof input.totalChunks === "number" &&
    typeof input.chunksEmbedded === "number" &&
    input.chunksEmbedded !== input.totalChunks
  ) {
    reasons.push(`chunks indexés incomplets (${input.chunksEmbedded}/${input.totalChunks})`);
  }

  if (isPdf(input.fileType, input.originalExtension) && (input.totalChunks || 0) <= 1) {
    reasons.push("PDF avec un seul chunk indexé, extraction à relire");
  }

  return reasons;
}

async function writeResources(input: {
  dryRun: boolean;
  exportedAt: string;
  outputDir: string;
  resources: ExportedResource[];
}): Promise<string[]> {
  if (input.dryRun) {
    return input.resources.map((resource) => resource.targetPath);
  }

  await mkdir(input.outputDir, { recursive: true });
  await removePreviouslyGeneratedFiles(input.outputDir);

  const generatedFiles: string[] = [];
  for (const resource of input.resources) {
    const targetPath = path.join(input.outputDir, resource.targetPath);
    assertInsideDirectory(input.outputDir, targetPath);
    await mkdir(path.dirname(targetPath), { recursive: true });
    await writeFile(targetPath, renderResource(resource, input.exportedAt), "utf8");
    generatedFiles.push(resource.targetPath);
  }

  return generatedFiles;
}

async function removePreviouslyGeneratedFiles(outputDir: string): Promise<void> {
  const manifestPath = path.join(outputDir, MANIFEST_FILE_NAME);

  try {
    const manifest = JSON.parse(await readFile(manifestPath, "utf8")) as unknown;
    if (!isRecord(manifest) || !Array.isArray(manifest.generatedFiles)) {
      return;
    }

    const excludedResourcePaths = Array.isArray(manifest.excludedResources)
      ? manifest.excludedResources
          .filter(isRecord)
          .map((resource) => readOptionalString(resource.targetPath))
          .filter((targetPath): targetPath is string => Boolean(targetPath))
      : [];

    for (const generatedFile of [...manifest.generatedFiles, ...excludedResourcePaths]) {
      if (typeof generatedFile !== "string") {
        continue;
      }
      const targetPath = path.join(outputDir, generatedFile);
      assertInsideDirectory(outputDir, targetPath);
      await rm(targetPath, { force: true });
    }
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      return;
    }
    throw error;
  }
}

function assertInsideDirectory(parentDir: string, childPath: string): void {
  const relativePath = path.relative(parentDir, childPath);
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Écriture refusée hors de ${parentDir} : ${childPath}`);
  }
}

function renderResource(resource: ExportedResource, exportedAt: string): string {
  const extension = path.extname(resource.targetPath).toLowerCase();
  const redactedContent = redactContent(resource.content || "");

  if (extension === ".json") {
    return formatJsonContent(redactedContent);
  }

  if (extension === ".csv") {
    return ensureTrailingNewline(redactedContent);
  }

  if (extension === ".md") {
    return renderMarkdownResource({ ...resource, content: redactedContent }, exportedAt);
  }

  return ensureTrailingNewline(redactedContent);
}

function redactContent(content: string): string {
  return CONTENT_REDACTIONS.reduce(
    (redactedContent, [pattern, replacement]) => redactedContent.replace(pattern, replacement),
    content,
  );
}

function formatJsonContent(content?: string): string {
  if (!content?.trim()) {
    return "{}\n";
  }

  try {
    return formatRepositoryJson(JSON.parse(content));
  } catch {
    return ensureTrailingNewline(content);
  }
}

function formatRepositoryJson(value: unknown): string {
  return `${compactPrimitiveArrays(JSON.stringify(value, null, 2))}\n`;
}

function compactPrimitiveArrays(json: string): string {
  const lines = json.split("\n");
  const formattedLines: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const arrayStart = parseJsonArrayStart(lines[index]);
    if (!arrayStart) {
      formattedLines.push(lines[index]);
      continue;
    }

    const { indent, propertyPrefix } = arrayStart;
    const items: string[] = [];
    let cursor = index + 1;
    let closingComma = "";
    let canCompact = true;

    for (; cursor < lines.length; cursor += 1) {
      if (lines[cursor] === `${indent}]` || lines[cursor] === `${indent}],`) {
        closingComma = lines[cursor].endsWith(",") ? "," : "";
        break;
      }

      const item = lines[cursor].slice(indent.length + 2);
      const itemValue = item.endsWith(",") ? item.slice(0, -1) : item;
      if (!isPrimitiveJsonValue(itemValue)) {
        canCompact = false;
        break;
      }
      items.push(itemValue);
    }

    const compactedLine = `${indent}${propertyPrefix}[${items.join(", ")}]${closingComma}`;
    if (canCompact && cursor < lines.length && compactedLine.length <= 100) {
      formattedLines.push(compactedLine);
      index = cursor;
      continue;
    }

    formattedLines.push(lines[index]);
  }

  return formattedLines.join("\n");
}

function parseJsonArrayStart(line: string): { indent: string; propertyPrefix: string } | null {
  const trimmedLine = line.trimStart();
  if (trimmedLine === "[") {
    return {
      indent: line.slice(0, line.length - trimmedLine.length),
      propertyPrefix: "",
    };
  }

  if (!trimmedLine.startsWith('"') || !trimmedLine.endsWith(": [")) {
    return null;
  }

  return {
    indent: line.slice(0, line.length - trimmedLine.length),
    propertyPrefix: trimmedLine.slice(0, -1),
  };
}

function isPrimitiveJsonValue(value: string): boolean {
  try {
    const parsedValue = JSON.parse(value) as unknown;
    return parsedValue === null || ["boolean", "number", "string"].includes(typeof parsedValue);
  } catch {
    return false;
  }
}

function renderMarkdownResource(resource: ExportedResource, exportedAt: string): string {
  const title = path.basename(resource.fileName, path.extname(resource.fileName));
  const frontmatter = {
    chunks_embedded: resource.chunksEmbedded,
    exported_at: exportedAt,
    file_id: resource.fileId,
    file_size_bytes: resource.fileSize,
    file_type: resource.fileType,
    original_file_name: resource.originalFileName,
    processing_status: resource.processingStatus,
    source_id: resource.sourceId,
    source_name: resource.sourceName,
    source_path: resource.logicalPath,
    total_chunks: resource.totalChunks,
    weak_extraction_reasons: resource.weakExtractionReasons,
  };

  return `---\n${toYaml(frontmatter)}---\n\n# ${title}\n\n> Source Letta Cloud : \`${resource.logicalPath}\`\n\n${ensureTrailingNewline(resource.content || "")}`;
}

function toYaml(values: Record<string, unknown>): string {
  return Object.entries(values)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${key}: ${formatYamlValue(value)}`)
    .join("\n")
    .concat("\n");
}

function formatYamlValue(value: unknown): string {
  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    return `\n${value.map((item) => `  - ${formatYamlScalar(item)}`).join("\n")}`;
  }
  return formatYamlScalar(value);
}

function formatYamlScalar(value: unknown): string {
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(String(value));
}

function buildManifest(input: {
  agentId: string;
  exportedAt: string;
  excludedResources: ExcludedResource[];
  generatedFiles: string[];
  resources: ExportedResource[];
}): ExportManifest {
  const chunksEmbedded = sum(input.resources.map((resource) => resource.chunksEmbedded));
  const totalChunks = sum(input.resources.map((resource) => resource.totalChunks));
  const weakExtractionWarnings = input.resources.filter(
    (resource) => resource.weakExtractionReasons.length > 0,
  ).length;
  const missingContent = input.resources.filter((resource) => !resource.content?.trim()).length;

  return {
    agentId: input.agentId,
    api: "GET /v1/agents/{agent_id}/export",
    generatedAt: input.exportedAt,
    generatedFiles: input.generatedFiles,
    excludedResources: input.excludedResources,
    resources: input.resources.map(({ content, ...resource }) => resource),
    summary: {
      chunksEmbedded,
      excludedFiles: input.excludedResources.length,
      files: input.resources.length,
      missingContent,
      totalChunks,
      weakExtractionWarnings,
    },
  };
}

function printSummary(manifest: ExportManifest, dryRun: boolean): void {
  const mode = dryRun ? "Dry run" : "Export";
  console.log(`${mode} terminé.`);
  console.log(`Fichiers normalisés : ${manifest.summary.files}`);
  console.log(`Fichiers exclus : ${manifest.summary.excludedFiles}`);
  console.log(
    `Chunks indexés : ${manifest.summary.chunksEmbedded}/${manifest.summary.totalChunks}`,
  );
  console.log(`Fichiers sans contenu extrait : ${manifest.summary.missingContent}`);
  console.log(`Alertes d'extraction faible : ${manifest.summary.weakExtractionWarnings}`);

  const warnings = manifest.resources.filter(
    (resource) => resource.weakExtractionReasons.length > 0,
  );
  for (const warning of warnings) {
    console.log(
      `- ${warning.logicalPath} -> ${warning.targetPath}: ${warning.weakExtractionReasons.join("; ")}`,
    );
  }
}

function readArray(value: unknown, fieldName: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`L'export Letta ne contient pas de tableau ${fieldName}`);
  }
  return value;
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function readOptionalNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function isPdf(fileType: string | undefined, extension: string): boolean {
  return extension === ".pdf" || fileType?.toLowerCase() === "application/pdf";
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNodeError(error: unknown): error is NodeJS.ErrnoException {
  return error instanceof Error && "code" in error;
}

function sum(values: Array<number | undefined>): number {
  return values.reduce((total, value) => total + (value || 0), 0);
}

function ensureTrailingNewline(value: string): string {
  return value.endsWith("\n") ? value : `${value}\n`;
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
