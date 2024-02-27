/*
All Rights Reserved, (c) 2024 CodeAtlas LTD.

Author: Martin Shaw (developer@martinshaw.co)
File Name: useIsMounting.ts
Created:  2024-02-26T15:48:22.476Z
Modified: 2024-02-26T15:48:22.476Z

Description: description
*/

import { useEffect, useRef } from 'react';

// useEffect is triggered whenever there is a change to the scoped state (including
// on first mount), this hook allows me to differentiate between the first mount
// and subsequent updates from within the useEffect hook.
//
// see: https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
const useIsMounting = () => {
  const isMountingRef = useRef(true);
  useEffect(() => {
    isMountingRef.current = false;
  }, []);

  return isMountingRef.current;
};

export default useIsMounting;
