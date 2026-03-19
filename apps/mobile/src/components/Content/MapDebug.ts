export const MAP_DEBUG = {
  ENABLE: true,
  TAG: "[MapDebug]",
};

export const logMapEvent = (event: string, data?: unknown) => {
  if (MAP_DEBUG.ENABLE) {
    const timestamp = new Date().toISOString().split("T")[1];
    console.log(`${MAP_DEBUG.TAG} ${timestamp} ${event}`, data !== undefined ? data : "");
  }
};

export const logMapError = (event: string, error: unknown) => {
  const timestamp = new Date().toISOString().split("T")[1];
  console.error(`${MAP_DEBUG.TAG} ${timestamp} ${event}`, error);
};
