import React, { useState, useEffect } from "react";

function Select({ onSelectChange, optionsArr, defaultVal, disabled, id }) {
  const [val, setVal] = useState(defaultVal);
  const [options, setOptions] = useState([]);

  const onInputChange = (newVal) => {
    setVal(newVal);
    onSelectChange(newVal);
  };

  useEffect(() => {
    const optionsJSX = optionsArr.map((option) => {
      return (
        <option key={option} value={option.split(" ")[0]}>
          {option[0].toUpperCase() + option.slice(1)}
        </option>
      );
    });
    setOptions(optionsJSX);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <select
        id={id}
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
