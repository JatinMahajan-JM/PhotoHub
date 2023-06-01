import React from "react";

function Paginator(props) {
  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      {props.currentPage > 1 && (
        <button className="pages" onClick={props.onPrevious}>
          Previous
        </button>
      )}
      {props.currentPage < props.lastPage && (
        <button className="pages" onClick={props.onNext}>
          Next
        </button>
      )}
    </div>
  );
}

export default Paginator;
