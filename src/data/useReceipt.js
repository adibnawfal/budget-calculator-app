import { useState, useEffect } from "react";

const useReceipt = (ref) => {
  const [dataState, setDataState] = useState({
    receipt: [],
  });

  useEffect(() => {
    return ref.orderBy("no").onSnapshot((snapshot) => {
      const receipt = [];

      snapshot.forEach((doc) => {
        receipt.push({ id: doc.id, ...doc.data() });
      });

      setDataState({
        receipt: receipt,
      });
    });
  }, []);

  return dataState;
};

export { useReceipt };
