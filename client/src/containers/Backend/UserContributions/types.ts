import { GetUserContributionsResponse } from "@refugies-info/api-types";

export interface FormattedUserContribution extends GetUserContributionsResponse {
  responsabilite: string | null;
  isAuthorizedToDelete: boolean;
}
