export interface AgirOperatorsSyncResponse {
  success: true;
  source: "grist";
  status: "fetched";
  message: string;
  recordCount: number;
  sampleDepartments: string[];
  warnings: string[];
}
