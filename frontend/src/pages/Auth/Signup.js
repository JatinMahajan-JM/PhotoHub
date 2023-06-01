import { useRef } from "react";
import useInput from "../../components/hooks/use-input";

function SignUp(props) {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  const submitHandler = (event) => {
    event.preventDefault();
    props.onSignUp(
      nameRef.current.value,
      emailRef.current.value,
      passwordRef.current.value
    );
  };

  const {
    error,
    blurHandler,
    inputChangeHandler,
    styles: style1,
  } = useInput(function checkEmail(input) {
    const re =
      /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(input);
  });
  const {
    error: errorPass,
    blurHandler: blurPass,
    inputChangeHandler: inputPass,
    styles: style2,
  } = useInput((v) => v.length >= 6);

  const formisValid = !error && !errorPass;
  return (
    <form onSubmit={submitHandler} className="form">
      <label htmlFor="name">Your Name</label>
      <input
        type="text"
        placeholder="everyman"
        ref={nameRef}
        id="name"
        className="inputs"
      />
      <label htmlFor="emails">Email</label>
      <input
        type="email"
        placeholder="e.g. you@mail.com"
        ref={emailRef}
        id="emails"
        className={style1}
        onChange={(e) => inputChangeHandler(e)}
        onBlur={blurHandler}
      />
      <label htmlFor="passwords">Password</label>
      <input
        type="password"
        placeholder="e.g. you12345"
        ref={passwordRef}
        id="passwords"
        className={style2}
        onChange={(e) => inputPass(e)}
        onBlur={blurPass}
      />
      <button
        style={{
          width: "100%",
          marginTop: "1rem",
          borderRadius: ".20rem",
          background: "#2f3b50",
        }}
        disabled={!formisValid ? true : false}
        type="submit"
      >
        SIGNUP
      </button>
    </form>
  );
}

export default SignUp;
