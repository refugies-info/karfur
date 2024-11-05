import React from "react";
import styles from "./CheckboxIcon.module.css";

const CheckboxIcon: React.FC = () => (
  <div className={styles.container}>
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.66649 10.113L12.7945 3.98438L13.7378 4.92704L6.66649 11.9984L2.42383 7.75571L3.36649 6.81304L6.66649 10.113Z"
        fill="#F5F5FE"
      />
    </svg>{" "}
  </div>
);

export default CheckboxIcon;
