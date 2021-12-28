import * as React from 'react';

export default function useMountedRef() {
  const mountedRef = React.useRef<boolean>(true);

  React.useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return mountedRef;
}
