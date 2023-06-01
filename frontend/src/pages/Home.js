import React from "react";
import Feed from "../components/Feed/Feed";
import NewPost from "../components/Feed/NewPost";
import Paginator from "../components/Feed/Paginator";
// import openSocket from "socket.io-client";
import { io as openSocket } from "socket.io-client";

class Home extends React.Component {
  state = {
    posts: [],
    open: false,
    editing: false,
    editValue: null,
    id: null,
    page: 1,
    totalPosts: 0,
  };
  // fetchPosts = () => {
  //   fetch("http://localhost:8080/post")
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log(data);
  //       this.setState({ posts: data.posts, open: false });
  //     });
  // };
  fetchPosts = (direction) => {
    let page = this.state.page;
    if (direction === "previous") {
      page--;
      this.setState({ page: page });
    }
    if (direction === "next") {
      page++;
      this.setState({ page: page });
    }
    // fetch("http://localhost:8080/post?page=" + page, {
    fetch("/post?page=" + page, {
      headers: { Authorization: "Beared " + this.props.token },
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          posts: data.posts,
          open: false,
          totalPosts: data.totalItems,
        });
      });
  };
  modalHandler = () => {
    this.setState((prevState) => {
      return {
        open: !prevState.open,
        editing: false,
      };
    });
  };
  editingHandler = (id, editValue) => {
    this.setState((prevState) => {
      return {
        editing: true,
        open: true,
        id: id,
        editValue: editValue,
      };
    });
  };

  deletePostHandler = (id) => {
    // fetch(`http://localhost:8080/post/${id}`, {
    fetch(`/post/${id}`, {
      method: "DELETE",
      headers: { Authorization: "Bearer " + this.props.token },
    }).then(() => {
      this.fetchPosts();
    });
  };

  likePostHandler = (id, liked) => {
    // fetch(`http://localhost:8080/post/like/${id}`, {
    fetch(`/post/like/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + this.props.token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ liked: liked }),
    }).then((res) => {
      if (res.status === 200) this.fetchPosts();
    });
  };
  componentDidMount() {
    this.fetchPosts();
    // const socket = openSocket("http://localhost:8080");
    const socket = openSocket("https://chats-rocket.herokuapp.com/");
    socket.on("post", (data) => {
      // if (data.action === "create")
      this.fetchPosts();
    });
  }

  render() {
    // let routes = (

    // )
    return (
      <React.Fragment>
        <Feed
          userId={this.props.userId}
          onClick={this.modalHandler}
          onEdit={this.editingHandler}
          posts={this.state.posts}
          onDelete={this.deletePostHandler}
          onLike={this.likePostHandler}
        />
        {this.state.open && (
          <NewPost
            onAdd={this.fetchPosts}
            onClick={this.modalHandler}
            editing={this.state.editing}
            id={this.state.id}
            token={this.props.token}
            editValue={this.state.editValue}
          />
        )}
        <Paginator
          onPrevious={this.fetchPosts.bind(this, "previous")}
          onNext={this.fetchPosts.bind(this, "next")}
          currentPage={this.state.page}
          lastPage={Math.ceil(this.state.totalPosts / 2)}
        />
      </React.Fragment>
    );
  }
}

export default Home;
