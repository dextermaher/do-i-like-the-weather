import React, { Component } from "react";
// import styles from "./BackgroundImage.module.css";
class BackgroundImage extends Component {
  // url

  render() {
    return <img className={this.props.className} src={this.props.url} alt="" />;
  }
}
export default BackgroundImage;
