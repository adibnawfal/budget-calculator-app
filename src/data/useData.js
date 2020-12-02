import { useState, useEffect } from "react";

const useData = (ref) => {
  const [dataState, setDataState] = useState({
    data: [],
    loading: true,
  });

  useEffect(() => {
    return ref
      .collection("data")
      .orderBy("no")
      .onSnapshot((snapshot) => {
        const data = [];

        snapshot.forEach((doc) => {
          data.push({ id: doc.id, ...doc.data() });
        });

        setDataState({
          data: data,
          loading: false,
        });
      });
  }, []);

  return dataState;
};

export { useData };
