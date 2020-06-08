import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Row,
} from "reactstrap";
import track from "react-tracking";
import "rc-slider/assets/index.css";

import UserChange from "../../../../components/Backend/User/UserChange/UserChange";
import API from "../../../../utils/API";

import "./UserForm.scss";

class UserForm extends Component {
  state = {
    orderedLangues: [],
    uploading: false,
    user: {},
    langues: [],
  };
  initial_state = { ...this.state };
  shadowSelectedLanguages = [];

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.user) {
      this.initial_state = {
        ...this.initial_state,
        user: this.props.location.state.user,
      };
      this.setState({ user: this.initial_state.user });
    } else {
      API.get_user_info().then(
        (data_res) => {
          this.initial_state = {
            ...this.initial_state,
            user: data_res.data.data,
          };
          this.setState({ user: this.initial_state.user });
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.log(error);
          return;
        }
      );
    }

    API.get_langues({}).then(
      (data_res) => {
        this.initial_state = {
          ...this.initial_state,
          langues: data_res.data.data
            .filter((el) => el.langueFr !== "Français")
            .map((el) => {
              return { ...el, isChecked: false };
            }),
        };
        this.setState({
          langues: this.initial_state.langues,
        });
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        return;
      }
    );
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: {
        ...this.state[event.target.name],
        [event.target.id]: event.target.value,
      },
    });
  };

  handleFileInputChange = (event) => {
    this.setState({ uploading: true });
    const formData = new FormData();
    formData.append(0, event.target.files[0]);

    API.set_image(formData).then(
      (data_res) => {
        let imgData = data_res.data.data;
        this.setState({
          user: {
            ...this.state.user,
            picture: imgData,
          },
          uploading: false,
        });
      },
      (error) => {
        // eslint-disable-next-line no-console
        console.log(error);
        this.setState({ uploading: false });
        return;
      }
    );
  };

  handleCheck = (event) => {
    let languesCopy = [...this.state.langues];
    let changedLangue =
      languesCopy[
        this.state.langues.findIndex((obj) => obj._id === event.target.id)
      ];
    changedLangue.isChecked = event.target.checked;
    let oldSelectedLanguages = [...this.state.user.selectedLanguages];
    this.setState({
      langues: languesCopy,
      user: {
        ...this.state.user,
        selectedLanguages: event.target.checked
          ? [...oldSelectedLanguages, changedLangue]
          : oldSelectedLanguages.filter((obj) => obj._id !== event.target.id),
      },
    });
    this.shadowSelectedLanguages = event.target.checked
      ? [...this.shadowSelectedLanguages, changedLangue]
      : this.shadowSelectedLanguages.filter(
          (obj) => obj._id !== event.target.id
        );
  };

  handleSliderChange = (value, name) => {
    this.setState({
      user: {
        ...this.state.user,
        [name]: value,
      },
    });
  };

  handleDraggableListChange = (value) => {
    let newOrder = [];
    value.forEach((item) => {
      newOrder.push({ ...this.state.user.selectedLanguages[item] });
    });
    this.shadowSelectedLanguages = newOrder;
  };

  validateUser = () => {
    let user = { ...this.state.user };
    if (this.shadowSelectedLanguages.length > 0) {
      user.selectedLanguages = [...this.shadowSelectedLanguages];
    }
    if (user.username.length === 0) {
      return;
    }
    if (user.selectedLanguages.length > 0) {
      user.selectedLanguages = [
        ...user.selectedLanguages.map((el) => {
          return {
            _id: el._id,
            i18nCode: el.i18nCode,
            langueCode: el.langueCode,
            langueFr: el.langueFr,
            langueLoc: el.langueLoc,
          };
        }),
      ];
    }
    API.set_user_info(user).then((data) => {
      let newUser = data.data.data;
      if (!newUser) {
        return;
      }
      this.props.history.push({
        pathname: "/backend/user-dashboard",
        state: { user: newUser },
      });
    });
  };

  onCancel = () => {
    this.setState({
      ...this.initial_state,
    });
  };

  render() {
    return (
      <div className="animated fadeIn user-form">
        <Card>
          <CardHeader>
            <strong>Formulaire</strong> Traducteur
          </CardHeader>
          <CardBody>
            <UserChange
              handleChange={this.handleChange}
              handleCheck={this.handleCheck}
              handleSliderChange={this.handleSliderChange}
              handleDraggableListChange={this.handleDraggableListChange}
              handleFileInputChange={this.handleFileInputChange}
              {...this.state}
            />
          </CardBody>
          <CardFooter>
            <Row>
              <Col>
                <Button
                  color="success"
                  size="lg"
                  block
                  onClick={this.validateUser}
                >
                  Valider
                </Button>
              </Col>
              <Col>
                <Button color="danger" size="lg" block onClick={this.onCancel}>
                  Annuler
                </Button>
              </Col>
            </Row>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

export default track(
  {
    page: "UserForm",
  },
  { dispatchOnMount: true }
)(UserForm);
