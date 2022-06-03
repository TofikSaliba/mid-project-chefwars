import React, { useState, useEffect } from "react";

function Select({ onSelectChange, optionsArr, defaultVal, disabled }) {
  const [val, setVal] = useState(defaultVal);
  const [options, setOptions] = useState([]);

  const onInputChange = (newVal) => {
    setVal(newVal);
    onSelectChange(newVal);
  };

  useEffect(() => {
    const optionsJSX = optionsArr.map((option) => {
      return (
        <option key={option} value={option}>
          {option.toUpperCase()}
        </option>
      );
    });
    setOptions(optionsJSX);
  }, []);

  return (
    <>
      <select
        id="mySelect"
        value={val}
        disabled={disabled}
        onChange={(e) => onInputChange(e.target.value)}
      >
        {options}
      </select>
    </>
  );
}

export default Select;
