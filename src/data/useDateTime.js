import { useState, useEffect } from "react";

const useDateTime = (ref) => {
  const [dataState, setDataState] = useState({
    date: "",
    time: "",
  });

  useEffect(() => {
    return ref.onSnapshot((doc) => {
      if (doc.exists) {
        setDataState({
          date: doc.data().date,
          time: doc.data().time,
        });
      }
    });
  }, []);

  return dataState;
};

export { useDateTime };
