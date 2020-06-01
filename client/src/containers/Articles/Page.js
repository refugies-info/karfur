import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import track from "react-tracking";
import { StyleSheet, css } from "aphrodite";

import blocks from "./blocks";
import Sidebar from "./sidebar";

class Page extends Component {
  state = {
    menuVisible: false,
  };

  toggleMenu = () => {
    let { menuVisible } = this.state;
    this.setState(
      {
        menuVisible: !menuVisible,
      },
      (param) => param
    );
  };

  render() {
    let {
      title,
      subtitle,
      description,
      sidebarImage,
      showLinks,
      children,
    } = this.props;
    let { menuVisible } = this.state;
    return (
      <div className="animated fadeIn full-height Page">
        <main className={css(blocks.wrapper, styles.main, blocks.fadein)}>
          <Sidebar
            title={title}
            subtitle={subtitle}
            description={description}
            sidebarImage={sidebarImage}
            menuVisible={menuVisible}
            showLinks={showLinks}
          />
          <section
            className={css(styles.content, menuVisible && styles.contentNarrow)}
          >
            {children}
          </section>
        </main>
      </div>
    );
  }
}

export default track({
  page: "Page",
})(withTranslation()(Page));

let styles = StyleSheet.create({
  page: {
    display: "flex",
    width: "100%",
    justifyContent: "flex-end",
    overflowX: "hidden",
    maxWidth: "100%",
  },
  main: {
    opacity: 1,
    width: "100%",
    display: "block",
    transition: "width linear 750ms",
    "@media (min-width: 768px)": {
      display: "block",
    },
    "@media (min-width: 992px)": {
      flexDirection: "row",
      display: "flex",
      justifyContent: "flex-end",
    },
    margin: 0,
    padding: 0,
    overflowX: "hidden",
    maxWidth: "100%",
  },
  mainNarrow: {
    margin: 0,
    width: "100%",
    "@media (min-width: 768px)": {
      width: "60%",
      display: "block",
    },
    "@media (min-width: 992px)": {
      display: "block",
      width: "70%",
    },
    "@media (min-width: 1200px)": {
      width: "75%",
      flexDirection: "row",
      display: "flex",
      justifyContent: "flex-end",
    },
  },
  content: {
    padding: "5rem",
    overflowX: "hidden",
    maxWidth: "100%",
    transition: "width linear 750ms",
    width: "100%",
    marginLeft: 0,
    "@media (min-width: 768px)": {
      width: "100%",
    },
    "@media (min-width: 992px)": {
      width: "60%",
    },
    "@media (min-width: 1200px)": {
      width: "60%",
    },
  },
  contentNarrow: {
    width: "100%",
    marginLeft: 0,
    "@media (min-width: 768px)": {
      width: "100%",
    },
    "@media (min-width: 992px)": {
      width: "100%",
    },
    "@media (min-width: 1200px)": {
      width: "52%",
    },
  },
  menuBurger: {
    position: "fixed",
    top: "1.5rem",
    left: "1.5rem",
    zIndex: "15",
    borderRadius: 5,
    height: "4rem",
    width: "4rem",
    background: "#333",
    paddingTop: 8,
    cursor: "pointer",
    borderBottom: "0 transparent",
    boxShadow: "#948b8b 2px 2px 10px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    outline: 0,
    border: 0,
    ":hover": {
      color: "#fff",
      outline: 0,
      background: "#999",
    },
    ":focus": {
      outline: 0,
    },
  },
  bar: {
    height: "0.5rem",
    width: "2.8rem",
    display: "block",
    margin: "0 6px 5px",
    background: "#fff",
    borderRadius: "0.3rem",
  },
});
