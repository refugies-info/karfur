import { useCallback, useState } from "react";
import useBoolean from "react-use/lib/useBoolean";

// eslint-disable-next-line no-unused-vars
const useStateOnce = <T>(defaultValue?: T): [T | undefined, (newValue: T) => void] => {
  const [setted, toggleSetted] = useBoolean(false);
  const [value, setValue] = useState<T | undefined>(defaultValue);

  const setter = useCallback(
    (newValue: T) => {
      if (!setted) {
        setValue(newValue);
        toggleSetted();
      }
    },
    [setted, toggleSetted], // Fixed dependencies
  );

  return [value, setter];
};

export default useStateOnce;
