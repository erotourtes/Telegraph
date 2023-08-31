import React from "react";
import { useEffect } from "react";

export const usePrevious = <T> (value: T) => {
  const ref = React.useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
