import React, { Component } from "react";
import PropTypes from "prop-types";
import EVAIcon from "../../../UI/EVAIcon/EVAIcon";
import { convertFromHTML } from "draft-convert";
import { MediaModal } from "./MediaModal";

class MediaUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: props.modalState,
      selectedCourseId: null
    };
  }

  toggleModal = () => {
      this.setState({modalState: !this.state.modalState})
  }

  render() {
    return (
      <div className="bloc-droite-alert blc-dr" onClick={this.toggleModal}>
        <EVAIcon name="alert-triangle-outline" />
        <MediaModal
          modalState={this.state.modalState}
          toggle={this.toggleModal}
        />
      </div>
    );
  }
}

export default MediaUpload;
