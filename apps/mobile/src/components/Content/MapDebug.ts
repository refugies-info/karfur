export const MAP_DEBUG = {
  ENABLE: __DEV__,
  TAG: "[MapDebug]",
};

export const logMapEvent = (event: string, data?: unknown) => {
  if (MAP_DEBUG.ENABLE) {
    const timestamp = new Date().toISOString().split("T")[1];
    console.log(`${MAP_DEBUG.TAG} ${timestamp} ${event}`, data !== undefined ? data : "");
  }
};
