import { useState, useEffect } from "react";

const useSemiPersistStorage = (key, initialState) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialState);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return { value, setValue };
};

export default useSemiPersistStorage;
