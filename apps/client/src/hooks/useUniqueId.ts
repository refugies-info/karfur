import { useEffect, useState } from "react"
import uniqueId from "lodash/uniqueId";

/**
 * Generates a uniq id to be used in the DOM.
 * Generation happens only on client side to prevent errors like "did not match on server/client"
 * @param prefix - optional
 * @returns a uniq id
 */
const useUniqueId = (prefix?: string) => {
  const [id, setId] = useState<string | undefined>(undefined)

  useEffect(() => {
    setId(`${prefix || ""}${uniqueId()}`)
  }, [prefix])

  return id
}

export default useUniqueId;
