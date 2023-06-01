import ReactDOM from "react-dom";

function Modal(props) {
  return ReactDOM.createPortal(
    <div className="modal">
      <div>{props.children}</div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={props.onClick} className="cancel">
          Cancel
        </button>
        <button onClick={props.onAdd}>Accept</button>
      </div>
    </div>,
    document.getElementById("modals")
  );
}

export default Modal;
