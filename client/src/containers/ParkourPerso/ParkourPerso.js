import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
import ScrollableAnchor, {
  goToAnchor,
  configureAnchors,
} from "react-scrollable-anchor";

import data from "./data";
import API from "../../utils/API";
import ParkourNow from "../../components/Frontend/ParkourPerso/ParkourNow";

import "./ParkourPerso.scss";

configureAnchors({ offset: -60 });
let user = { _id: null, cookies: {} };
let nbLoaded = 0;
class ParkourPerso extends Component {
  state = {
    etapes: data.map((x, id) => {
      return { ...x, active: id === 1 };
    }),
    dispositifs: [],
    articles: [],
    demarches: data.map((x) => {
      return { ...x, checked: false };
    }),
  };

  componentDidMount() {
    this.getDispositifs({}, 3);
    this.getArticles({}, 3);
  }

  componentDidUpdate() {
    if (
      this.state.dispositifs.length > 0 &&
      this.state.articles.length > 0 &&
      user.cookies &&
      user._id &&
      user.cookies.parkourPerso !== this.state
    ) {
      user.cookies.parkourPerso = this.state;
      API.set_user_info(user);
    }
  }

  getDispositifs = (filter = {}, limit = null) => {
    API.get_dispositif({ query: filter, limit }).then(
      (data_res) => {
        this.setState(
          {
            dispositifs: data_res.data.data.map((x) => {
              return { ...x, checked: false };
            }),
          },
          () => {
            this.getCookies();
          }
        );
      },
      function (error) {
        console.log(error);
        return;
      }
    );
  };

  getArticles = (filter = {}, limit = null) => {
    API.get_article(filter, "fr", {}, "", limit).then(
      (data_res) => {
        this.setState(
          {
            articles: data_res.data.data.map((x) => {
              return { ...x, checked: false };
            }),
          },
          () => {
            this.getCookies();
          }
        );
      },
      function (error) {
        console.log(error);
        return;
      }
    );
  };

  getCookies = () => {
    nbLoaded++;
    if (nbLoaded === 2) {
      API.get_user_info().then(
        (data_res) => {
          let u = data_res.data.data;
          user = { _id: u._id, cookies: u.cookies || {} };
          let park = user.cookies.parkourPerso;
          this.setState(
            {
              etapes: data.map((x, id) => {
                return { ...x, active: park.etapes[id].active };
              }),
              dispositifs: [...this.state.dispositifs].map((x, id) => {
                return {
                  ...x,
                  checked: park.dispositifs[id].checked,
                  bookmarked: park.dispositifs[id].bookmarked,
                };
              }),
              articles: [...this.state.articles].map((x, id) => {
                return {
                  ...x,
                  checked: park.articles[id].checked,
                  bookmarked: park.articles[id].bookmarked,
                };
              }),
              demarches: [...this.state.demarches].map((x, id) => {
                return {
                  ...x,
                  checked: park.demarches[id].checked,
                  bookmarked: park.demarches[id].bookmarked,
                };
              }),
            },
            () => {
              nbLoaded++;
            }
          );
        },
        function (error) {
          console.log(error);
          return;
        }
      );
    }
  };

  checkItem = (key, name, etape = 0) => {
    let prevState = [...this.state[name + "s"]];
    prevState[key + etape].checked = !prevState[key + etape].checked;
    this.setState({ [name + "s"]: prevState });
    if (name === "demarche") {
      this.setActive(
        Math.min(key + etape + 1, this.state.demarches.length - 1)
      );
      goToAnchor(
        "etape-" + Math.min(key + etape + 1, this.state.demarches.length - 1)
      );
    }
  };

  setActive = (key) => {
    this.setState({
      etapes: data.map((x, id) => {
        return { ...x, active: id === key };
      }),
    });
  };

  setBookmark = (key, name, etape = null) => {
    let prevState = [...this.state[name + "s"]];
    prevState[key + etape].bookmarked = !prevState[key + etape].bookmarked;
    this.setState({ [name + "s"]: prevState });
  };

  render() {
    return (
      <div className="animated fadeIn parkour-perso">
        {this.state.etapes.map((etape, key) => {
          return (
            <div
              className={"timeline-item" + (etape.active ? " active" : "")}
              key={key}
            >
              <ScrollableAnchor id={"etape-" + key}>
                <h1 onClick={() => this.setActive(key)}>{etape.title}</h1>
              </ScrollableAnchor>
              {etape.active && (
                <ParkourNow
                  checkItem={this.checkItem}
                  setBookmark={this.setBookmark}
                  etape={key}
                  {...this.state}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }
}

export default track({
  page: "ParkourPerso",
})(withTranslation()(ParkourPerso));
