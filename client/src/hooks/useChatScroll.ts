import { useEffect, useRef } from "react";

function useChatScroll(dep: unknown) {
  const ref = useRef<HTMLElement>();

  useEffect(() => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.scrollTop = ref.current.scrollHeight;
      }
    }, 100);
  }, [dep]);

  return ref;
}

export default useChatScroll;
