export const isTitreInformatifObject = (
  toBeDetermined: Record<string, string> | string
): toBeDetermined is Record<string, string> => {
  if ((toBeDetermined as Record<string, string>).fr) {
    return true;
  }
  return false;
};
