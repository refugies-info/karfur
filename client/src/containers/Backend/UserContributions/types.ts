import { GetUserContributionsResponse } from "api-types";

export interface FormattedUserContribution extends GetUserContributionsResponse {
  responsabilite: string | null;
  isAuthorizedToDelete: boolean;
}
