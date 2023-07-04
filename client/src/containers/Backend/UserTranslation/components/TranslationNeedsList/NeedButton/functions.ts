import { NeedTradStatus } from "containers/Backend/UserTranslation/types"

export const getClassStatus = (status: NeedTradStatus): "info" | "warning" | "success" => {
  switch (status) {
    case NeedTradStatus.TO_TRANSLATE:
      return "info"
    case NeedTradStatus.TO_REVIEW:
      return "warning"
    case NeedTradStatus.TRANSLATED:
      return "success"
  }
}
