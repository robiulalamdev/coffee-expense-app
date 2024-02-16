import { useState } from "react";

const useInputPattern = () => {
  const handleNumber = (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
  };

  return {
    handleNumber,
  };
};

export default useInputPattern;
