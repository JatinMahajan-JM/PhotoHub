import React, { useEffect, useRef, useState } from "react";
import Backdrop from "../Modal/Backdrop";
import Modal from "../Modal/Modal";

//created modal >> on accept >> change inputs as state in component
function NewPost(props) {
  const titleRef = useRef();
  const [imageValue, setImage] = useState(null);
  // const contentRef = useRef();
  const [status, setStatus] = useState(null);
  const [imagePreview, setPreview] = useState(null);
  const { onAdd } = props;

  const fileChangeHandler = (event) => {
    if (event.target.files.length !== 0) {
      setImage(event.target.files[0]);
      const reader = new FileReader();
      new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (err) => reject(err);
      })
        .then((result) => {
          setPreview(result);
        })
        .catch(() => {
          setPreview(null);
        });

      reader.readAsDataURL(event.target.files[0]);
    } else {
      setPreview(null);
    }
  };

  const addPost = () => {
    const formData = new FormData();
    formData.append("title", titleRef.current.value);
    // formData.append("imageUrl", imageValue);
    // formData.append("content", contentRef.current.value);

    // let url = "http://localhost:8080/post";
    let url = "/post";

    let method = "POST";

    if (props.editing) {
      url = `/post/${props.id}`;
      method = "PUT";
    }

    fetch(url, {
      method: method,
      headers: { Authorization: "Bearer " + props.token },
      // body: JSON.stringify({
      //   title: titleRef.current.value,
      //   imageUrl: imageRef.current.value,
      //   content: contentRef.current.value,
      // }),
      body: formData,
    }).then((res) => {
      setStatus("completed");
    });
  };

  useEffect(() => {
    if (status === "completed") {
      onAdd();
      setStatus(null);
    }
  }, [status, onAdd]);
  return (
    <React.Fragment>
      <Backdrop />
      <Modal onClick={props.onClick} onAdd={addPost}>
        {/* <label htmlFor="title">Title</label> */}
        <textarea
          rows="5"
          type="textarea"
          id="title"
          placeholder="Write something about yourself..."
          ref={titleRef}
          defaultValue={props.editing ? props.editValue : ""}
        />
        <label htmlFor="image" className="file">
          Upload Image
        </label>
        {/* {!imagePreview && props.editing && (
          <p style={{ fontSize: "13px", color: "#79818b", marginLeft: "2px" }}>
            Note: The old image will be kept, if not changed
          </p>
        )} */}
        <p style={{ fontSize: "13px", color: "#79818b", marginLeft: "2px" }}>
          Note: Images are currently not accepted by our server, so you can't
          upload images for now
        </p>
        {imagePreview && (
          <img
            style={{ width: "50%", display: "block" }}
            src={imagePreview}
            alt="paper"
          />
        )}
        <input
          type="file"
          id="image"
          placeholder="Party pic url"
          onChange={fileChangeHandler}
        />
        {/* <label htmlFor="content">Content</label>
        <input
          type="text"
          id="content"
          placeholder="Mention your Vibes"
          style={{ margin: "10px 0 30px 0" }}
          ref={contentRef}
        /> */}
      </Modal>
    </React.Fragment>
  );
}

export default NewPost;
