import React, { Component } from "react";
import { Nav, NavItem, NavLink, TabContent } from "reactstrap";
import Swal from "sweetalert2";
import _ from "lodash";
import passwdCheck from "zxcvbn";
import produce from "immer";

import CustomTabPane from "../../../components/Backend/Admin/CustomTabPane";
import API from "../../../utils/API";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";

import "./Admin.scss";
import { colors } from "colors";
import styled from "styled-components";

const OngletText = styled.span`
  color: ${(props) => (props.isActive ? colors.bleuCharte : colors.darkColor)};
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
`;

const OngletContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  background: #f2f2f2;
`;

const Onglet = (props) => (
  <OngletContainer>
    <div style={{ marginBottom: "3px" }}>
      <EVAIcon
        name={props.isSelected ? props.iconSelected : props.iconNotSelected}
        fill={props.isSelected ? colors.bleuCharte : colors.noir}
        className="mr-8"
      />
    </div>
    <OngletText isActive={props.isSelected}>{props.text}</OngletText>
  </OngletContainer>
);

export class Admin extends Component {
  state = {
    activeTab: "0",
    orderedLangues: [],
    roles: [],
    users: [],
    langues: [],
    structures: [],
    uploading: false,
    order: "username",
    croissant: true,

    user: {
      picture: {
        imgId: "",
        public_id: "",
        secure_url: "",
      },
      username: "",
      password: "",
      email: "",
      phone: "",
      description: "",
      selectedLanguages: [],
      objectifTemps: 20,
      objectifMots: 600,
      roles: [],
      _id: undefined,
      status: "Actif",
      progression: null,
    },

    langue: {
      langueFr: "",
      langueLoc: "",
      langueCode: "",
      langueIsDialect: false,
      langueBackupId: undefined,
      i18nCode: "",
      _id: undefined,
      status: "Active",
      avancement: 0,
      participants: [],
    },

    theme: {
      themeNom: "",
      themeDescription: "",
      themeIsUnder: false,
      themeUnderId: "undefined",
      _id: undefined,
      status: "Actif",
      avancement: 0,
      participants: [],
      articles: [],
    },

    structure: {
      nom: "",
      acronyme: "",
      link: "",
      contact: "",
      mail_contact: "",
      phone_contact: "",
      authorBelongs: false,
      status: "Actif",
      picture: {
        imgId: "",
        public_id: "",
        secure_url: "",
      },
      siren: "",
      siret: "",
      adresse: "",
      mail_generique: "",
      createur: {},
      administrateur: undefined,
      alt: "",
    },
  };
  initial_state = { ...this.state };
  shadowSelectedLanguages = [];

  componentDidMount() {
    document.title = "Contenus";
    API.get_roles({}).then((data_res) => {
      this.setState({
        roles: data_res.data.data.map((el) => {
          return { ...el, isChecked: false };
        }),
      });
    });

    API.get_users({ sort: { username: 1 } }).then((data_res) => {
      this.setState({ users: data_res.data.data });
    });

    API.get_langues({}).then((data_res) => {
      this.setState({
        langues: data_res.data.data
          .filter((el) => el.langueFr !== "Français")
          .map((el) => {
            return { ...el, isChecked: false };
          }),
      });
    });

    API.get_structure({}, {}, "createur").then((data_res) => {
      this.setState({ structures: data_res.data.data });
    });
  }

  async componentDidUpdate(_, prevState) {
    if (
      this.state.user &&
      prevState.user._id !== this.state.user._id &&
      this.state.user._id
    ) {
      let progression = await API.get_progression({
        userId: this.state.user._id,
      });
      this.setState(
        produce((draft) => {
          draft.user.progression = progression.data;
          return;
        })
      );
    }
    if (prevState.activeTab !== this.state.activeTab) {
      if (this.state.activeTab === 0) {
        document.title = "Contenus";
      } else if (this.state.activeTab === 1) {
        document.title = "Structures";
      } else if (this.state.activeTab === 2) {
        document.title = "Utilisateurs";
      } else if (this.state.activeTab === 3) {
        document.title = "Languages";
      }
    }
  }

  toggleTab = (tab) =>
    this.setState(() => ({
      activeTab: tab,
    }));

  handleChange = (event) => {
    this.setState({
      [event.target.name]: {
        ...this.state[event.target.name],
        [event.target.id
          .replace("B|><", "")
          .replace("T|=R", "")
          .replace("K//R", "")]: event.target.value,
      },
    });
  };

  handleFileInputChange = (event) => {
    const name = event.currentTarget.name;
    this.setState({ uploading: true });
    const formData = new FormData();
    formData.append(0, event.target.files[0]);

    API.set_image(formData).then((data_res) => {
      let imgData = data_res.data.data;
      this.setState({
        [name]: {
          ...this.state[name],
          picture: imgData,
        },
        uploading: false,
      });
    });
  };

  onSelect = async (item, switchTo = null) => {
    this.setState(item);
    if (item.user) {
      this.setState({
        langues: [
          ...this.state.langues.map((el) => {
            return {
              ...el,
              isChecked: item.user.selectedLanguages.find(
                (x) => x._id === el._id
              )
                ? true
                : false,
            };
          }),
        ],
        roles: [
          ...this.state.roles.map((el) => {
            return { ...el, isChecked: item.user.roles.includes(el._id) };
          }),
        ],
      });
    }
    switchTo && this.toggleTab(switchTo);
  };

  handleCheck = (event) => {
    if (event.target.className.includes("langue")) {
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
    } else {
      let roleCopy = [...this.state.roles];
      let changedRole =
        roleCopy[
          this.state.roles.findIndex((obj) => obj._id === event.target.id)
        ];
      changedRole.isChecked = event.target.checked;
      let oldRoles = [...this.state.user.roles];
      this.setState({
        roles: roleCopy,
        user: {
          ...this.state.user,
          roles: event.target.checked
            ? [...oldRoles, event.target.id]
            : oldRoles.filter((obj) => obj !== event.target.id),
        },
      });
    }
  };

  handleBelongsChange = () =>
    this.setState((pS) => ({
      structure: {
        ...pS.structure,
        authorBelongs: !pS.structure.authorBelongs,
      },
    }));

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

  reorder = (table, order = "username") => {
    const croissant = order === this.state.order ? !this.state.croissant : true;
    this.setState((pS) => ({
      [table]: pS[table].sort((a, b) => {
        const aValue = _.get(a, order),
          bValue = _.get(b, order);
        return aValue > bValue
          ? croissant
            ? 1
            : -1
          : aValue < bValue
          ? croissant
            ? -1
            : 1
          : 0;
      }),
      order: order,
      croissant: croissant,
    }));
  };

  validateUser = () => {
    let user = { ...this.state.user };
    if (this.shadowSelectedLanguages.length > 0) {
      user.selectedLanguages = [...this.shadowSelectedLanguages];
    }
    if (user.username.length === 0) {
      return Swal.fire({
        title: "Oops...",
        text: "Aucun nom d'utilisateur n'est renseigné !",
        type: "error",
        timer: 1500,
      });
    }
    if (user.password.length === 0) {
      return Swal.fire({
        title: "Oops...",
        text: "Aucun mot de passe n'est renseigné !",
        type: "error",
        timer: 1500,
      });
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
    if (!user._id) {
      if ((passwdCheck(user.password) || {}).score < 1) {
        return Swal.fire({
          title: "Oops...",
          text: "Le mot de passe est trop faible",
          type: "error",
          timer: 1500,
        });
      }
      API.login({ ...user, cpassword: user.password }).then(
        (data) => {
          let newUser = data.data.data;
          newUser.password = "Hidden";
          this.setState({
            users: [...this.state.users, newUser],
            user: this.initial_state.user,
          });
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.log(error);
          return;
        }
      );
    } else {
      API.set_user_info(user).then(
        (data) => {
          let newUser = data.data.data;
          if (!newUser) {
            return;
          }
          newUser.password = "Hidden";
          let usersCopy = [...this.state.users];
          usersCopy[
            this.state.users.findIndex((obj) => obj._id === newUser._id)
          ] = newUser;
          this.setState({ users: usersCopy, user: this.initial_state.user });
        },
        (error) => {
          // eslint-disable-next-line no-console
          console.log(error);
          return;
        }
      );
    }
    this.setState({
      langues: [
        ...this.state.langues.map((el) => {
          return { ...el, isChecked: false };
        }),
      ],
      roles: [
        ...this.state.roles.map((el) => {
          return { ...el, isChecked: false };
        }),
      ],
    });
  };

  preTraitementStruct = () => {
    if (
      !this.state.structure.nom ||
      !this.state.structure.contact ||
      (!this.state.structure.mail_contact &&
        !this.state.structure.phone_contact)
    ) {
      Swal.fire({
        title: "Oh non!",
        text: "Certaines informations sont manquantes",
        type: "error",
        timer: 1500,
      });
      return;
    }
    let struct = { ...this.state.structure };
    let membres = struct.membres || [];
    if (struct.administrateur === struct.createur._id) {
      membres = membres.some((x) => x.userId === struct.createur._id)
        ? membres.map((x) =>
            x.userId === struct.createur._id
              ? { ...x, roles: ["createur", "administrateur"] }
              : {
                  ...x,
                  roles: (x.roles || []).filter((z) => z !== "administrateur"),
                }
          )
        : [
            ...membres.map((y) => ({
              ...y,
              roles: y.roles.filter((z) => z !== "administrateur"),
            })),
            {
              userId: struct.createur._id,
              roles: ["createur", "administrateur"],
              added_at: new Date(),
            },
          ];
    } else if (struct.authorBelongs) {
      membres = membres.some((x) => x.userId === struct.createur._id)
        ? membres.map((x) =>
            x.userId === struct.createur._id
              ? { ...x, roles: ["createur", "contributeur"] }
              : {
                  ...x,
                  roles: (x.roles || []).filter((z) => z !== "administrateur"),
                }
          )
        : [
            ...membres.map((y) => ({
              ...y,
              roles: y.roles.filter((z) => z !== "administrateur"),
            })),
            {
              userId: struct.createur._id,
              roles: ["createur", "contributeur"],
              added_at: new Date(),
            },
          ];
      membres = membres.some((x) => x.userId === struct.administrateur)
        ? membres.map((x) =>
            x.userId === struct.administrateur
              ? { ...x, roles: ["administrateur"] }
              : {
                  ...x,
                  roles: (x.roles || []).filter((z) => z !== "administrateur"),
                }
          )
        : [
            ...membres.map((y) => ({
              ...y,
              roles: y.roles.filter((z) => z !== "administrateur"),
            })),
            {
              userId: struct.administrateur,
              roles: ["administrateur"],
              added_at: new Date(),
            },
          ];
    } else {
      membres = membres.some((x) => x.userId === struct.administrateur)
        ? membres.map((x) =>
            x.userId === struct.administrateur
              ? { ...x, roles: ["administrateur"] }
              : {
                  ...x,
                  roles: (x.roles || []).filter((z) => z !== "administrateur"),
                }
          )
        : [
            ...membres.map((y) => ({
              ...y,
              roles: y.roles.filter((z) => z !== "administrateur"),
            })),
            {
              userId: struct.administrateur,
              roles: ["administrateur"],
              added_at: new Date(),
            },
          ];
    }
    this.setState(
      {
        structure: {
          ...this.state.structure,
          membres: membres,
          createur: (this.state.structure.createur || {})._id,
        },
      },
      () => this.onValidate("structure")
    );
  };

  onValidate = (tab) => {
    API["create_" + tab](this.state[tab]).then((data) => {
      let newItem = data.data.data;
      if (this.state.theme._id) {
        let itemsCopy = [...this.state[tab + "s"]];
        itemsCopy[
          this.state[tab + "s"].findIndex((obj) => obj._id === newItem._id)
        ] = newItem;
        this.setState({ [tab + "s"]: itemsCopy });
      } else {
        this.setState({
          [tab + "s"]: this.state[tab]._id
            ? this.state[tab + "s"].map((x) =>
                x._id === this.state[tab]._id ? newItem : x
              )
            : [...this.state[tab + "s"], newItem],
        });
      }
      this.setState({ [tab]: this.initial_state[tab] });
      if (tab === "structure") {
        // this.props.fetchStructures();
      }
    });
  };

  onCancel = (tab) => {
    this.setState({
      [tab]: this.initial_state[tab],
      langues: [
        ...this.state.langues.map((el) => {
          return { ...el, isChecked: false };
        }),
      ],
      roles: [
        ...this.state.roles.map((el) => {
          return { ...el, isChecked: false };
        }),
      ],
    });
  };

  render() {
    return (
      <div className="animated fadeIn admin">
        <Nav>
          <NavItem>
            <NavLink
              active={this.state.activeTab === "0"}
              onClick={() => {
                this.toggleTab("0");
              }}
            >
              <Onglet
                iconSelected="file-add"
                iconNotSelected="file-add-outline"
                text="Contenus"
                isSelected={this.state.activeTab === "0"}
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.activeTab === "1"}
              onClick={() => {
                this.toggleTab("1");
              }}
            >
              <Onglet
                iconSelected="shopping-bag"
                iconNotSelected="shopping-bag-outline"
                text="Structures"
                isSelected={this.state.activeTab === "1"}
              />
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={this.state.activeTab === "2"}
              onClick={() => {
                this.toggleTab("2");
              }}
            >
              <Onglet
                iconSelected="person"
                iconNotSelected="person-outline"
                text="Utilisateurs"
                isSelected={this.state.activeTab === "2"}
              />
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              active={this.state.activeTab === "3"}
              onClick={() => {
                this.toggleTab("3");
              }}
            >
              <Onglet
                iconSelected="pie-chart"
                iconNotSelected="pie-chart-outline"
                text="Statistiques"
                isSelected={this.state.activeTab === "3"}
              />
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <CustomTabPane
            handleChange={this.handleChange}
            onSelect={this.onSelect}
            handleCheck={this.handleCheck}
            handleSliderChange={this.handleSliderChange}
            handleDraggableListChange={this.handleDraggableListChange}
            handleFileInputChange={this.handleFileInputChange}
            handleBelongsChange={this.handleBelongsChange}
            validateUser={this.validateUser}
            onValidate={this.onValidate}
            onCancel={this.onCancel}
            preTraitementStruct={this.preTraitementStruct}
            isAdmin={true}
            initial_state={this.initial_state}
            reorder={this.reorder}
            {...this.state}
          />
        </TabContent>
      </div>
    );
  }
}

export default Admin;
