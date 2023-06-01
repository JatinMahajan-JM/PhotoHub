import ReactDOM from "react-dom";

function Backdrop() {
  return ReactDOM.createPortal(
    <div className="backdrop"></div>,
    document.getElementById("backdrop")
  );
}

export default Backdrop;
