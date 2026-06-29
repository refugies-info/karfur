import type { AgirOperatorsSyncResponse } from "@refugies-info/api-types";
import { InternalError, ServiceUnavailableError } from "~/errors";
import logger from "~/logger";

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

const extractDepartmentCode = (department: unknown): string | null => {
  if (typeof department !== "string") return null;

  const match = department.trim().match(/^(\d{2,3})/);
  return match?.[1] ?? null;
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
  const sampleDepartments = gristData.records
    .map((record) => extractDepartmentCode(record.fields.Departement))
    .filter((department): department is string => !!department);

  logger.info("[agirOperators] Grist records fetched", {
    recordCount: gristData.records.length,
    sampleDepartments,
  });

  return {
    success: true,
    source: "grist",
    status: "fetched",
    message: "Les opérateurs AGIR ont bien été récupérés depuis Grist, sans publication",
    recordCount: gristData.records.length,
    sampleDepartments,
    warnings: [],
  };
};
