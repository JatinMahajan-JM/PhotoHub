function Post({ item, onEdit, onDelete, userId, onLike }) {
  const editHandler = () => {
    onEdit(item._id, item.title);
  };
  const deleteHandler = () => {
    onDelete(item._id);
  };
  const likeHandler = () => {
    onLike(item._id, item.liked);
  };
  const a = localStorage.getItem("status");
  return (
    <article>
      {/* <hr size="1" /> */}
      <header>
        {/* <h3 style={{ color: "gainsboro" }}>{item.creator.name}</h3> */}
        <div>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              color: "#fafafa",
              display: "inline-block",
              marginRight: "6px",
            }}
          >
            {item.creator.name.toUpperCase()}
          </p>
          {a === "online" && item.creator._id === userId && (
            <div
              style={{
                display: "inline-block",
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: "#86eb86",
                marginBottom: "1.3px",
              }}
            ></div>
          )}
          <p>
            {new Date(item.createdAt).toDateString().toString() +
              " " +
              new Date(item.createdAt)
                .toLocaleTimeString("en-US", {
                  hour12: true,
                  hour: "numeric",
                  minute: "numeric",
                })
                .toString()}
          </p>
        </div>
        <p style={{ margin: "11px 0" }}>{item.title}</p>
        {item.imageUrl && (
          <img src={`/${item.imageUrl}`} style={{ width: "100%" }} alt="img" />
        )}
        {/* <h3>{item.content}</h3> */}
      </header>
      <p style={{ margin: "11px 0" }}>{item.likes} Likes</p>
      <div>
        <button onClick={likeHandler} className={item.liked ? "unlike" : ""}>
          {item.liked ? "Unlike" : "Like"}
        </button>
        {/* <button>View</button> */}
        {item.creator._id === userId && (
          <button onClick={editHandler}>Edit</button>
        )}
        {item.creator._id === userId && (
          <button onClick={deleteHandler}>Delete</button>
        )}
        {/* <hr size="1" /> */}
      </div>
    </article>
  );
}

export default Post;
