export const getScreenFromUrl = (url: string): {
  screenName: "ContentScreen",
  params: any
}|null => {
  // Dispositif
  const rx = /dispositif\/[a-z|0-9]*/g;
  const res = rx.exec(url);
  if (res && res[0]) {
    return {
      screenName: "ContentScreen",
      params: {
        contentId: res[0].replace("dispositif/", "")
      }
    }
  }

  return null;
};
