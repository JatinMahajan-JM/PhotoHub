import React, { Fragment } from "react";
import Post from "./Post";

class Feed extends React.Component {
  render() {
    return (
      <Fragment>
        {/* <form>
          <input
            type="text"
            placeholder="Status"
            style={{ width: "30%", padding: "7px" }}
          />
          <button>UPDATE</button>
        </form> */}
        <div style={{ display: "grid", placeItems: "center" }}>
          {/* <button
            onClick={this.props.onClick}
            style={{ margin: "20px 0", padding: "10px 106px" }}
          >
            New Post
          </button> */}
          <div onClick={this.props.onClick} className="newpost">
            <div className="add">+</div>
            <div>
              <p>Add a new Story</p>
              <p style={{ color: "#79818b" }}>Share an image, or some text</p>
            </div>
          </div>
          {this.props.posts.map((item) => (
            <Post
              userId={this.props.userId}
              item={item}
              key={item._id}
              onEdit={this.props.onEdit}
              onDelete={this.props.onDelete}
              onLike={this.props.onLike}
            />
          ))}
        </div>
      </Fragment>
    );
  }
}

export default Feed;
