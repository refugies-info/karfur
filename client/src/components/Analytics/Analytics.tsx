import { useAnalytics } from "hooks";

/**
 * Proxy component for Analytics
 *
 * This component must be placed under ConsentManagerProvider
 * (we can't use directly useAnalytics in _app.tsx because of this).
 */
const Analytics = () => {
  useAnalytics();
  return null;
};

export default Analytics;
