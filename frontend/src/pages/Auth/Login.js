import { useRef } from "react";
import useInput from "../../components/hooks/use-input";

function Login(props) {
  const emailRef = useRef();
  const passwordRef = useRef();
  const loginHandler = (event) => {
    event.preventDefault();
    props.onLogin(emailRef.current.value, passwordRef.current.value);
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
    <form
      onSubmit={loginHandler}
      className="form"
      // style={{
      //   width: "30%",
      //   margin: "auto",
      //   marginTop: "4rem",
      //   textAlign: "start",
      //   padding: "4rem",
      //   background: "#202836",
      //   borderRadius: ".85rem",
      // }}
    >
      <label htmlFor="email">Email</label>
      <input
        type="email"
        placeholder="e.g. you@mail.com"
        ref={emailRef}
        id="email"
        // className={!error && !touched ? "inputs valid" : "inputs invalid"}
        className={style1}
        onChange={(e) => inputChangeHandler(e)}
        onBlur={blurHandler}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        placeholder="e.g. you12345"
        ref={passwordRef}
        id="password"
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
        LOGIN
      </button>
    </form>
  );
}

export default Login;
