import { useEffect, useRef, useState } from "react";

export const useHeight = () => {
  const [height, setHeight] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHeight(ref.current?.offsetHeight || 0);
  });

  return { height, ref } as const;
};
