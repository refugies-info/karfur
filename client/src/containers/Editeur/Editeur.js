import React, { Component } from "react";
import track from "react-tracking";
import { convertFromRaw } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Button,
  FormGroup,
  Input,
  FormFeedback,
} from "reactstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

import API from "../../utils/API";

import "./Editeur.css";

const content = {
  entityMap: {},
  blocks: [
    {
      key: "0",
      text: "",
      type: "unstyled",
      depth: 0,
      inlineStyleRanges: [],
      entityRanges: [],
      data: {},
    },
  ],
};

class Editeur extends Component {
  state = {
    contentState: convertFromRaw(content),
    title: "",
    itemId: "",
  };

  onContentStateChange = (contentState) => {
    this.setState({
      contentState,
    });
  };

  handleTitleChange = (event) => {
    this.setState({
      title: event.target.value,
    });
  };

  valider_article = () => {
    let article = {
      title: this.state.title,
      body: this.state.contentState,
    };
    API.add_article(article).then(
      (data_res) => {
        this.setState({
          itemId: data_res.data.article._id,
        });
      },
      function (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return;
      }
    );
  };

  navigate_to_article = () => {
    this.props.tracking.trackEvent({
      action: "click",
      label: "navigate_to_article",
      value: this.state.itemId,
    });
  };

  render() {
    return (
      <div className="animated fadeIn editeur">
        <Card className="full-page">
          <CardHeader>
            <FormGroup>
              <Input
                type="text"
                invalid={this.state.title === ""}
                valid={this.state.title !== ""}
                id="inputIsValid"
                placeholder="Titre..."
                value={this.state.title}
                onChange={this.handleTitleChange}
              />
              <FormFeedback className="help-block">
                Le titre de l'article est obligatoire
              </FormFeedback>
            </FormGroup>
          </CardHeader>
          <CardBody>
            <Editor
              toolbarClassName="toolbar-editeur"
              wrapperClassName="wrapper-editeur"
              editorClassName="editor-editeur"
              placeholder="Ecrivez ici votre article..."
              onContentStateChange={this.onContentStateChange}
            />
          </CardBody>

          <CardFooter>
            <Button
              onClick={this.valider_article}
              color="success"
              size="lg"
              block
            >
              Suggérer cet article
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default track({
  page: "Editeur",
})(Editeur);
