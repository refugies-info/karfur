import type { AgirOperator } from "@refugies-info/api-types";
import { operatorsPerDepartment as staticOperatorsPerDepartment } from "data/agirOperators";

export type OperatorsPerDepartment = Record<string, AgirOperator>;

const AGIR_OPERATORS_PUBLIC_URL =
  "https://storage.googleapis.com/refugies-info-assets/agir/operators/current.json";

export const fallbackOperatorsPerDepartment =
  staticOperatorsPerDepartment as OperatorsPerDepartment;

const isOperatorsPerDepartment = (value: unknown): value is OperatorsPerDepartment => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.values(value).every(
    (operator) =>
      !!operator &&
      typeof operator === "object" &&
      typeof (operator as AgirOperator).department === "string" &&
      typeof (operator as AgirOperator).operator === "string",
  );
};

export const fetchAgirOperatorsPerDepartment = async (): Promise<OperatorsPerDepartment> => {
  try {
    const response = await fetch(AGIR_OPERATORS_PUBLIC_URL);
    if (!response.ok) {
      console.error("[agirOperators] Failed to fetch GCS JSON", {
        status: response.status,
        url: AGIR_OPERATORS_PUBLIC_URL,
      });
      return fallbackOperatorsPerDepartment;
    }

    const data = (await response.json()) as { operatorsPerDepartment?: unknown };
    if (!isOperatorsPerDepartment(data.operatorsPerDepartment)) {
      console.error("[agirOperators] Invalid GCS JSON format", {
        url: AGIR_OPERATORS_PUBLIC_URL,
      });
      return fallbackOperatorsPerDepartment;
    }

    return data.operatorsPerDepartment;
  } catch (error) {
    console.error("[agirOperators] Error while fetching GCS JSON", {
      error: error instanceof Error ? error.message : error,
      url: AGIR_OPERATORS_PUBLIC_URL,
    });
    return fallbackOperatorsPerDepartment;
  }
};
