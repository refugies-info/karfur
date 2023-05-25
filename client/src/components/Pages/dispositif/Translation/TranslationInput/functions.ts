import { Suggestion } from "hooks/dispositif";

export enum UserTradStatus {
  TO_TRANSLATE = "À traduire",
  PENDING = "En cours",
  TRANSLATED = "Traduit",
  MISSING = "Manquant"
}

export const getUserTradStatus = (mySuggestion: Suggestion, suggestions: Suggestion[], showMissingSteps: boolean | undefined): UserTradStatus => {
  // no text, show missing steps
  if (!mySuggestion.text && suggestions.length === 0 && showMissingSteps) return UserTradStatus.MISSING
  // my text is pending if I have one, if I don't, all the others are pending
  if ((!!mySuggestion.text && mySuggestion.toFinish) || !mySuggestion.text && suggestions.length > 0 && suggestions.length === suggestions.filter(s => s.toFinish).length) return UserTradStatus.PENDING;
  // I have one text or another one exists
  if (!!mySuggestion.text || suggestions.length > 0) return UserTradStatus.TRANSLATED
  // else
  return UserTradStatus.TO_TRANSLATE
}

export enum ExpertTradStatus {
  TO_TRANSLATE = "À traduire",
  TO_VALIDATE = "À valider",
  TO_REVIEW = "À revoir",
  PENDING = "En cours",
  VALIDATED = "Validé",
  MISSING = "Manquant"
}

export const getExpertTradStatus = (mySuggestion: Suggestion, suggestions: Suggestion[], showMissingSteps: boolean | undefined): ExpertTradStatus => {
  // no text, showMissingSteps is active
  if (!mySuggestion.text && suggestions.length === 0 && showMissingSteps) return ExpertTradStatus.MISSING

  // my text is pending if I have one, if I don't, all the others are pending
  if (
    (!!mySuggestion.text && mySuggestion.toFinish) ||
    !mySuggestion.text && suggestions.length > 0 && suggestions.length === suggestions.filter(s => s.toFinish).length
  ) return ExpertTradStatus.PENDING;

  // my text exists and is to review
  if (
    !!mySuggestion.text && mySuggestion.toReview
  ) return ExpertTradStatus.TO_REVIEW;

  // no text and at least 1 suggestion finished
  if (
    !mySuggestion.text && (suggestions || []).filter(s => !s.toFinish).length > 0
  ) return ExpertTradStatus.TO_VALIDATE;

  // my text exists
  if (!!mySuggestion.text) return ExpertTradStatus.VALIDATED

  // else
  return ExpertTradStatus.TO_TRANSLATE
}

type SuggestionDisplay = {
  text: string;
  username: string;
  picture: "me" | "google" | "user";
  status: UserTradStatus | ExpertTradStatus;
}

export const getDisplay = (mySuggestion: Suggestion, suggestions: Suggestion[], username: string, showMissingSteps: boolean | undefined, forExpert: boolean = false): SuggestionDisplay => {
  const status = !forExpert
    ? getUserTradStatus(mySuggestion, suggestions, showMissingSteps)
    : getExpertTradStatus(mySuggestion, suggestions, showMissingSteps);

  // 1. my suggestion
  if (!!mySuggestion.text) {
    return {
      text: mySuggestion.text,
      username: mySuggestion.validator?.username || username,
      picture: !!mySuggestion.validator ? "user" : "me",
      status
    };
  }

  // 2. first translated suggestion
  if (suggestions.length > 0) {
    const firstTranslated = suggestions.find(s => !s.toFinish) || suggestions[0];
    return {
      text: firstTranslated.text,
      username: firstTranslated.author.username,
      picture: "user",
      status
    };
  }

  // 3. google translate
  return {
    text: "", // translated afterwards
    username: "Google Translate",
    picture: "google",
    status: status
  };
}


type StatusStyle = {
  type: "error" | "new" | "warning" | "success" | "info";
  icon: string;
}

export const getStatusStyle = (status: UserTradStatus | ExpertTradStatus): StatusStyle => {
  if ([UserTradStatus.MISSING, ExpertTradStatus.MISSING].includes(status)) {
    return {
      type: "error",
      icon: "close-circle"
    }
  }
  if ([UserTradStatus.PENDING, ExpertTradStatus.PENDING].includes(status)) {
    return {
      type: "new",
      icon: "pause-circle-outline"
    }
  }
  if (ExpertTradStatus.TO_REVIEW === status) {
    return {
      type: "warning",
      icon: "alert-circle"
    }
  }
  if ([UserTradStatus.TRANSLATED, ExpertTradStatus.VALIDATED].includes(status)) {
    return {
      type: "success",
      icon: "checkmark-circle-2"
    }
  }
  return {
    type: "info",
    icon: "radio-button-off-outline"
  }
}

export type FooterStatus = {
  status: "default" | "pending" | "success"
  text: string
}

export const getFooterStatus = (index: number, mySuggestion: Suggestion, suggestions: Suggestion[]): FooterStatus => {
  // My suggestion
  if (index === -1) {
    return mySuggestion.toFinish || mySuggestion.toReview || !mySuggestion.text
      ? {
        status: "pending",
        text: "Proposition en cours",
      }
      : {
        status: "success",
        text: "Ma proposition",
      };
  }
  // google translate
  if (index === suggestions.length) {
    return {
      status: "default",
      text: "",
    };
  }

  // user suggestions
  return {
    status: "default",
    text: `Proposition ${index + 1}/${suggestions.length} ${suggestions[index].toFinish ? "(non terminée)" : ""}`,
  };
}
