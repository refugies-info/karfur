import React, { Component } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FButton from "../../../FigmaUI/FButton/FButton";
import styled from "styled-components";
import Tab from "./StyledTab";
import Dropzone from "react-dropzone";
import API from "../../../../utils/API";
import { logger } from "logger";

const Tabs = styled.div`
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
`;

const getColor = (props) => {
  if (props.isDragAccept) {
    return "#00e676";
  }
  if (props.isDragReject) {
    return "#ff1744";
  }
  if (props.isDragActive) {
    return "#2196f3";
  }
  return "#eeeeee";
};

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
`;

const Image = styled.img`
  display: flex;
  width: 100%;
`;

class MediaModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalState: props.modalState,
      selectedTab: "photo",
      image: null,
      video: null,
      pdf: null,
      loading: false,
    };
  }

  onSelect = (name) => {
    this.setState({ selectedTab: name });
  };

  validate = () => {
    this.props.insertBlock("image", this.state.image.secure_url);
    this.props.toggle();
  };

  uploadImageCallBack(file) {
    return new Promise((resolve, reject) => {
      this.setState({ loading: true });
      //On l'envoie ensuite au serveur
      const formData = new FormData();
      formData.append(0, file);
      API.set_image(formData)
        .then((data_res) => {
          let response = data_res.data.data;
          response.link = response.secure_url;
          this.setState({ loading: false });
          resolve({ data: response });
        })
        .catch((e) => {
          this.setState({ loading: false });
          logger.error("uploadImageCallBack error", { error: e });

          reject(e);
        });
    });
  }

  render() {
    return (
      <Modal
        isOpen={this.props.modalState}
        toggle={this.props.toggle}
        className="dispositif-validate-modal"
      >
        <ModalHeader toggle={this.props.toggle}>Ajouter un média</ModalHeader>
        <ModalBody>
          <Tabs>
            <Tab
              onClick={() => this.onSelect("photo")}
              icon={"image-outline"}
              title={"Photo"}
              selected={this.state.selectedTab === "photo"}
            />
            <Tab
              onClick={() => this.onSelect("video")}
              icon={"video-outline"}
              title={"Vidéo"}
              selected={this.state.selectedTab === "video"}
            />
            <Tab
              onClick={() => this.onSelect("pdf")}
              icon={"attach-outline"}
              title={"PDF"}
              selected={this.state.selectedTab === "pdf"}
            />
          </Tabs>
          <Dropzone
            onDrop={async (acceptedFiles) => {
              this.setState({
                image: acceptedFiles.map((file) =>
                  Object.assign(file, {
                    preview: URL.createObjectURL(file),
                  })
                ),
              });
              const imageData = await this.uploadImageCallBack(
                acceptedFiles[0]
              );
              this.setState({ image: imageData.data });
            }}
            accept={"image/jpeg, image/png"}
          >
            {({
              getRootProps,
              getInputProps,
              isDragActive,
              isDragAccept,
              isDragReject,
            }) => (
              <section>
                <Container
                  {...getRootProps({
                    isDragActive,
                    isDragAccept,
                    isDragReject,
                  })}
                >
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                  {this.state.image ? (
                    <Image src={this.state.image.secure_url} />
                  ) : null}
                </Container>
              </section>
            )}
          </Dropzone>
          <p>
            Merci d’ajouter <b>une phrase explicative</b> décrivant votre fiche.{" "}
            <br />
            Elle sera affichée dans les résultats de recherche.
          </p>
        </ModalBody>
        <ModalFooter>
          <span className={"text-danger"}>sur 110 caractères restants</span>
          <FButton onClick={this.validate} name="checkmark" type="validate">
            Envoyer
          </FButton>
        </ModalFooter>
      </Modal>
    );
  }
}

export default MediaModal;
