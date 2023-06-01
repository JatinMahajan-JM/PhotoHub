import { useState } from "react";

function useInput(validation) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const valid = validation(value);
  const error = !valid && touched;
  let count = 0;

  const inputChangeHandler = (event) => {
    setValue(event.target.value);
    if (count < 1) {
      setTouched(true);
      count++;
    }
  };

  const blurHandler = () => {
    setTouched(true);
  };

  let styles;
  if (!error && !touched) {
    styles = "inputs";
  } else if (touched && !error) {
    styles = "inputs valid";
  } else {
    styles = "inputs invalid";
  }
  return { styles, error, inputChangeHandler, blurHandler, touched };
}

export default useInput;
