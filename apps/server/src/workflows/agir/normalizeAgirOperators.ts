import type { AgirOperator, AgirOperatorsSyncWarning } from "@refugies-info/api-types";
import { InvalidRequestError } from "~/errors";

export interface AgirGristRecord {
  id: number;
  fields: Record<string, unknown>;
}

interface NormalizedAgirOperators {
  operatorsPerDepartment: Record<string, AgirOperator>;
  warnings: AgirOperatorsSyncWarning[];
}

interface AgirOperatorsSyncError {
  field: string;
  message: string;
  recordId: number;
}

const isValidEmail = (email: string): boolean => /^\S+@\S+\.\S+$/.test(email);

const cleanString = (
  value: unknown,
  context: { field: string; recordId: number; warnings: AgirOperatorsSyncWarning[] },
): string => {
  if (typeof value !== "string") return "";

  const cleanedValue = value.trim();
  if (value !== cleanedValue) {
    context.warnings.push({
      code: "trimmed_value",
      field: context.field,
      message: `Le champ ${context.field} contient des espaces ou retours ligne inutiles et a été nettoyé.`,
      recordId: context.recordId,
    });
  }

  return cleanedValue;
};

const extractDepartmentCode = (department: string): string | null => {
  const match = department.match(/^(\d{2,3})(?:\s*-|\b)/);
  return match?.[1] ?? null;
};

const extractDispositifId = (ficheRi: string): string | null => {
  const match = ficheRi.match(/[a-f\d]{24}/i);
  return match?.[0] ?? null;
};

export const normalizeAgirOperators = (records: AgirGristRecord[]): NormalizedAgirOperators => {
  const operatorsPerDepartment: Record<string, AgirOperator> = {};
  const warnings: AgirOperatorsSyncWarning[] = [];
  const errors: AgirOperatorsSyncError[] = [];

  for (const record of records) {
    const department = cleanString(record.fields.Departement, {
      field: "Departement",
      recordId: record.id,
      warnings,
    });
    const depNumber = extractDepartmentCode(department);

    if (!depNumber) {
      errors.push({
        field: "Departement",
        message: "Le département est manquant ou mal formé.",
        recordId: record.id,
      });
      continue;
    }

    if (operatorsPerDepartment[depNumber]) {
      errors.push({
        field: "Departement",
        message: `Le département ${depNumber} est présent plusieurs fois dans Grist.`,
        recordId: record.id,
      });
      continue;
    }

    const operator = cleanString(record.fields.Operateur, {
      field: "Operateur",
      recordId: record.id,
      warnings,
    });

    if (!operator) {
      errors.push({
        field: "Operateur",
        message: `L'opérateur du département ${depNumber} est vide.`,
        recordId: record.id,
      });
      continue;
    }

    const email = cleanString(record.fields.Mail_generique, {
      field: "Mail_generique",
      recordId: record.id,
      warnings,
    });
    const phone = cleanString(record.fields.Telephone, {
      field: "Telephone",
      recordId: record.id,
      warnings,
    });
    const ficheRi = cleanString(record.fields.Fiche_RI, {
      field: "Fiche_RI",
      recordId: record.id,
      warnings,
    });

    const operatorData: AgirOperator = {
      department,
      operator,
    };

    if (email) {
      if (isValidEmail(email)) {
        operatorData.email = email;
      } else {
        warnings.push({
          code: "invalid_email",
          field: "Mail_generique",
          message: `L'email du département ${depNumber} est invalide et ne sera pas affiché.`,
          recordId: record.id,
        });
      }
    }

    if (phone) operatorData.phone = phone;

    if (ficheRi) {
      const dispositifId = extractDispositifId(ficheRi);
      if (dispositifId) {
        operatorData.dispositifId = dispositifId;
      } else {
        warnings.push({
          code: "invalid_dispositif_link",
          field: "Fiche_RI",
          message: `Le lien fiche RI du département ${depNumber} est invalide et ne sera pas affiché.`,
          recordId: record.id,
        });
      }
    }

    operatorsPerDepartment[depNumber] = operatorData;
  }

  if (Object.keys(operatorsPerDepartment).length === 0) {
    errors.push({
      field: "records",
      message: "Aucun opérateur AGIR valide n'a été trouvé dans Grist.",
      recordId: 0,
    });
  }

  if (errors.length > 0) {
    throw new InvalidRequestError("[agirOperators] Invalid Grist AGIR operators data", undefined, {
      errors,
      warnings,
    });
  }

  return {
    operatorsPerDepartment,
    warnings,
  };
};
