import { useCallback, useState } from "react";
import useBoolean from "react-use/lib/useBoolean";

const useStateOnce = <T extends unknown>(defaultValue?: T) => {
  const [setted, toggleSetted] = useBoolean(false);
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const setter = useCallback<any>(
    (newValue: T): any => {
      if (!setted) {
        setValue(newValue);
        toggleSetted();
      }
    },
    [value]
  );
  return [value, setter];
};

export default useStateOnce;
