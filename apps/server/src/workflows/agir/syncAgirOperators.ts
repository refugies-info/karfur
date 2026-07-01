import type { AgirOperatorsSyncResponse } from "@refugies-info/api-types";
import { InternalError, ServiceUnavailableError } from "~/errors";
import logger from "~/logger";
import { normalizeAgirOperators } from "./normalizeAgirOperators";
import { uploadAgirOperatorsJsonToGcs } from "./uploadAgirOperatorsJsonToGcs";

interface GristRecord {
  id: number;
  fields: Record<string, unknown>;
}

interface GristRecordsResponse {
  records: GristRecord[];
}

const getRequiredEnv = (
  key: "GRIST_AGIR_API_URL" | "GRIST_AGIR_API_KEY" | "AGIR_OPERATORS_GCS_OBJECT",
): string => {
  const value = process.env[key];

  if (!value) {
    throw new InternalError(`[agirOperators] Missing ${key} environment variable`);
  }

  return value;
};

const buildCheckObjectName = (currentObjectName: string, date = new Date()): string => {
  const lastSlashIndex = currentObjectName.lastIndexOf("/");
  const directory = lastSlashIndex >= 0 ? currentObjectName.slice(0, lastSlashIndex) : "";
  const timestamp = date.toISOString().replace(/[:.]/g, "-");
  const checkFileName = `sync-check-${timestamp}.json`;

  return directory ? `${directory}/_checks/${checkFileName}` : `_checks/${checkFileName}`;
};

const fetchAgirOperatorsFromGrist = async (): Promise<GristRecordsResponse> => {
  const gristApiUrl = getRequiredEnv("GRIST_AGIR_API_URL");
  const gristApiKey = getRequiredEnv("GRIST_AGIR_API_KEY");

  try {
    const response = await fetch(gristApiUrl, {
      headers: {
        Authorization: `Bearer ${gristApiKey}`,
      },
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      throw new ServiceUnavailableError(
        `[agirOperators] Grist request failed with status ${response.status}`,
      );
    }

    const data = (await response.json()) as GristRecordsResponse;

    if (!Array.isArray(data.records)) {
      throw new ServiceUnavailableError(
        "[agirOperators] Invalid Grist response: records is missing",
      );
    }

    return data;
  } catch (error) {
    logger.error("[agirOperators] Grist fetch failed", {
      error: error instanceof Error ? error.message : error,
    });

    if (error instanceof ServiceUnavailableError) throw error;
    throw new ServiceUnavailableError("[agirOperators] Unable to fetch AGIR operators from Grist");
  }
};

export const syncAgirOperators = async (): Promise<AgirOperatorsSyncResponse> => {
  const gristData = await fetchAgirOperatorsFromGrist();
  const { operatorsPerDepartment, warnings } = normalizeAgirOperators(gristData.records);
  const departmentCount = Object.keys(operatorsPerDepartment).length;
  const gcsCurrentObjectName = getRequiredEnv("AGIR_OPERATORS_GCS_OBJECT");
  const gcsCheckObjectName = buildCheckObjectName(gcsCurrentObjectName);
  const publicPayload = {
    generatedAt: new Date().toISOString(),
    source: "grist",
    status: "published",
    recordCount: gristData.records.length,
    departmentCount,
    operatorsPerDepartment,
  };

  await uploadAgirOperatorsJsonToGcs({
    objectName: gcsCheckObjectName,
    payload: {
      ...publicPayload,
      warnings,
    },
  });

  await uploadAgirOperatorsJsonToGcs({
    objectName: gcsCurrentObjectName,
    payload: publicPayload,
  });

  logger.info("[agirOperators] Grist records fetched", {
    departmentCount,
    gcsCheckObjectName,
    gcsCurrentObjectName,
    recordCount: gristData.records.length,
    warningCount: warnings.length,
  });

  if (warnings.length > 0) {
    logger.warn("[agirOperators] Grist records normalized with warnings", { warnings });
  }

  return {
    success: true,
    source: "grist",
    status: "published",
    message: "Les opérateurs AGIR ont bien été publiés depuis Grist",
    recordCount: gristData.records.length,
    departmentCount,
    operatorsPerDepartment,
    gcsCheckObjectName,
    gcsCurrentObjectName,
    warnings,
  };
};
