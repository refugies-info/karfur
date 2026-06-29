import type { AgirOperatorsSyncResponse } from "@refugies-info/api-types";
import { InternalError, ServiceUnavailableError } from "~/errors";
import logger from "~/logger";
import { normalizeAgirOperators } from "./normalizeAgirOperators";

interface GristRecord {
  id: number;
  fields: Record<string, unknown>;
}

interface GristRecordsResponse {
  records: GristRecord[];
}

const getRequiredEnv = (key: "GRIST_AGIR_API_URL" | "GRIST_AGIR_API_KEY"): string => {
  const value = process.env[key];

  if (!value) {
    throw new InternalError(`[agirOperators] Missing ${key} environment variable`);
  }

  return value;
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

  logger.info("[agirOperators] Grist records fetched", {
    departmentCount,
    recordCount: gristData.records.length,
    warningCount: warnings.length,
  });

  if (warnings.length > 0) {
    logger.warn("[agirOperators] Grist records normalized with warnings", { warnings });
  }

  return {
    success: true,
    source: "grist",
    status: "validated",
    message: "Les opérateurs AGIR ont bien été vérifiés depuis Grist, sans publication",
    recordCount: gristData.records.length,
    departmentCount,
    operatorsPerDepartment,
    warnings,
  };
};
