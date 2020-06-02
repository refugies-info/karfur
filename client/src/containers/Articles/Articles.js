import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
import { StyleSheet, css } from "aphrodite";

import Page from "./Page";
import blocks from "./blocks";
import Article from "./article";
import Category from "./category";

import SidePhoto from "../../assets/immigration-square.jpg";
import API from "../../utils/API";
import "./Articles.css";

class Articles extends Component {
  state = {
    activePanel: "posts",
    articles: [],
    categories: [
      { uri: "/", title: "Contes pour enfants", id: 0, image: SidePhoto },
    ],
  };

  componentDidMount() {
    API.get_article({ isStructure: { $ne: true } }).then((data_res) => {
      let articles = data_res.data.data;
      this.setState({
        articles: articles,
      });
    });
  }

  setActivePanel = (event) => {
    let panel = event.target.dataset.panel;
    this.setState({
      activePanel: panel,
    });
  };

  render() {
    let { activePanel } = this.state;
    return (
      <div className="animated fadeIn full-height articles">
        <Page
          title="Procédure d'asile"
          subtitle="L'ensemble des démarches à effectuer"
          description="Suivez les démarches pour obtenir un titre de séjour légal en France"
          sidebarImage={SidePhoto}
          showLinks={true}
        >
          <div className={css(styles.subNav)}>
            <button
              className={css(
                styles.button,
                activePanel === "posts" && styles.buttonActive
              )}
              onClick={this.setActivePanel}
              data-panel="posts"
            >
              Posts
            </button>
            <button
              className={css(
                styles.button,
                activePanel === "categories" && styles.buttonActive
              )}
              onClick={this.setActivePanel}
              data-panel="categories"
            >
              Categories
            </button>
          </div>
          <div
            className={css(
              styles.list,
              activePanel === "posts" ? blocks.fadein : styles.hide
            )}
          >
            {this.state.articles.map((article) => (
              <Article
                key={article._id}
                article={article}
                category={{ title: "Contes pour enfants" }}
              />
            ))}
          </div>
          <div
            className={css(
              styles.list,
              activePanel === "categories" ? blocks.fadein : styles.hide
            )}
          >
            {this.state.categories.map((category) => (
              <Category key={category.id} category={category} />
            ))}
          </div>
          {/* <DisqusCount /> */}
        </Page>
      </div>
    );
  }
}

export default track({
  page: "Articles",
})(withTranslation()(Articles));

let styles = StyleSheet.create({
  subNav: {
    borderBottom: "solid 1px #f5f5f5",
    lineHeight: "3rem",
  },
  button: {
    borderBottom: "solid 2px #000",
    display: "inline-block",
    fontWeight: 700,
    marginRight: "10px",
    fontSize: "1.2rem",
    fontFamily: "\"Source Sans Pro\",Helvetica,Arial,sans-serif",
    textTransform: "uppercase",
    cursor: "pointer",
    backgroundColor: "transparent",
    outline: 0,
    lineHeight: "30px",
    letterSpacing: "2pt",
    textDecoration: "none",
    color: "#b6b6b6",
    border: "none",
    ":active": {
      borderBottom: "solid 2px #000",
      color: "#333337",
    },
    ":hover": {
      borderBottom: "solid 2px #000",
      color: "#333337",
    },
    ":focus": {
      outline: 0,
    },
  },
  buttonActive: {
    borderBottom: "solid 2px #000",
    color: "#333337",
  },
  list: {
    animation: "fadein 2s",
    display: "flex",
    flexWrap: "wrap",
    width: "100%",
    justifyContent: "space-between",
  },

  hide: {
    position: "absolute",
    top: "-9999px",
    left: "-9999px",
    display: "none",
  },
});
