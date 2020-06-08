/* eslint-disable no-use-before-define */
import React from "react";
import { StyleSheet, css } from "aphrodite";

let Sidebar = ({ title, subtitle, description, sidebarImage }) => (
  <aside
    className={css(styles.sidebar)}
    style={{ backgroundImage: `url(${sidebarImage})` }}
  >
    <div className={css(styles.info)}>
      <div className={css(styles.primary)}>
        <h1 className={css(styles.h1)}>{title}</h1>
        <p className={css(styles.p)}>{subtitle}</p>
        <p className={css(styles.p)}>{description}</p>
      </div>
    </div>
  </aside>
);

export default Sidebar;

let styles = StyleSheet.create({
  sidebar: {
    justifyContent: "flex-start",
    alignItems: "flex-start",
    transition: "width linear 750ms, height linear 750ms, left linear 750ms",
    padding: 0,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    position: "relative",
    width: "100%",
    height: "100%",
    "@media (min-width: 768px)": {
      height: "45rem",
      position: "relative",
      width: "100%",
    },
    "@media (min-width: 992px)": {
      height: "100%",
      backgroundColor: "#f5f5f5",
      width: "40%",
      left: 0,
    },
    "@media (min-width: 1200px)": {
      height: "100%",
      backgroundColor: "#f5f5f5",
      width: "40%",
      left: 0,
    },
    overflowX: "hidden",
    maxWidth: "100%",
  },
  info: {
    padding: "5%",
    background: "rgba(50,50,50,.5)",
    color: "#fafafa",
    height: "28rem",
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "end",
    flexDirection: "column",
  },

  primary: {
    borderBottom: "solid 1px rgba(255,255,255,.3)",
    marginBottom: "1.6rem",
  },
  h1: {
    letterSpacing: 0,
    marginBottom: 0,
    fontSize: "3.4rem",
    textShadow: "0 1px 3px rgba(0,0,0,.3)",
    fontWeight: 700,
    fontFamily: "'Source Sans Pro',Helvetica,Arial,sans-serif",
  },
  p: {
    marginBottom: 10,
    textShadow: "0 1px 3px rgba(0,0,0,.3)",
    lineHeight: "2.4rem",
    fontSize: "1.8rem",
  },
  links: {
    display: "none",
  },
  showLinks: {
    display: "flex",
  },
  button: {
    fontFamily: "'Source Sans Pro',Helvetica,Arial,sans-serif",
    display: "inline-block",
    color: "#fff",
    marginRight: "20px",
    marginBottom: 0,
    backgroundColor: "#337ab7",
    borderColor: "#2e6da4",
    fontWeight: 400,
    textAlign: "center",
    touchAction: "manipulation",
    cursor: "pointer",
    border: "1px solid transparent",
    whiteSpace: "nowrap",
    padding: "6px 12px",
    fontSize: "14px",
    lineHeight: "1.42857",
    borderRadius: "4px",
    userSelect: "none",
    ":hover": {
      color: "#fff",
      backgroundColor: "#286090",
      borderColor: "#204d74",
      textDecoration: "none",
    },
    ":focus": {
      color: "#fff",
      backgroundColor: "#286090",
      borderColor: "#122b40",
      textDecoration: "none",
    },
  },
});
