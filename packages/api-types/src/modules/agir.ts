export interface AgirOperator {
  dispositifId?: string;
  department: string;
  operator: string;
  email?: string;
  phone?: string;
}

export type AgirOperatorsSyncWarningCode =
  | "trimmed_value"
  | "invalid_email"
  | "invalid_dispositif_link";

export interface AgirOperatorsSyncWarning {
  code: AgirOperatorsSyncWarningCode;
  field: string;
  message: string;
  recordId: number;
}

export interface AgirOperatorsSyncResponse {
  success: true;
  source: "grist";
  status: "validated";
  message: string;
  recordCount: number;
  departmentCount: number;
  operatorsPerDepartment: Record<string, AgirOperator>;
  gcsCheckObjectName: string;
  warnings: AgirOperatorsSyncWarning[];
}
