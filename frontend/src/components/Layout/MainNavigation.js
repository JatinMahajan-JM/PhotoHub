import { Fragment } from "react";
import { Link } from "react-router-dom";

function MainNavigation(props) {
  let links = (
    <div>
      <Link to="/">LOGIN</Link>
      <Link to="/signup">SIGNUP</Link>
    </div>
  );

  if (props.isAuth) {
    links = (
      <div>
        {/* <Link to="/feeds">FEED</Link> */}
        <button style={{ background: "#202836" }} onClick={props.onLogout}>
          LOGOUT
        </button>
      </div>
    );
  }
  return (
    <Fragment>
      <div
        className="mainNav"
        // style={{
        //   display: "flex",
        //   justifyContent: "space-between",
        //   placeItems: "center",
        //   background: "rgb(24 27 34)",
        //   padding: "10px 20px",
        //   marginBottom: "1rem",
        // }}
      >
        <h3 className="mainheading">SOCIAL ROCKET</h3>
        {/* <div>
          <Link to="/feeds">FEED</Link>
          <button>LOGOUT</button>
        </div> */}
        {links}
      </div>
      <div>{props.children}</div>
    </Fragment>
  );
}

export default MainNavigation;
