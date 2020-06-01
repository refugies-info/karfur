import React, { Component } from "react";
import PropTypes from "prop-types";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import { convertFromHTML } from "draft-convert";
import MediaModal from "./MediaModal";

class MediaUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: true,
      selectedCourseId: null,
    };
  }

  toggleModal = () => {
    this.setState({ modalState: !this.state.modalState });
  };

  render() {
    return (
      <div
        className="blc-gh-media bloc-gauche-media"
        onClick={this.toggleModal}
      >
        <EVAIcon name="image-outline" />
        <MediaModal
          modalState={this.state.modalState}
          toggle={this.toggleModal}
          insertBlock={this.props.insertBlock}
        />
      </div>
    );
  }
}

export default MediaUpload;
