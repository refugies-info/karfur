import { useEffect, useLayoutEffect } from "react";
import isInBrowser from "../lib/isInBrowser";

/**
 * A version of useLayoutEffect that falls back to useEffect when rendering on the server.
 * This avoids the React warning about useLayoutEffect doing nothing on the server.
 */
const useIsomorphicLayoutEffect = isInBrowser() ? useLayoutEffect : useEffect;

export default useIsomorphicLayoutEffect;
