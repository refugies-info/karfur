import React from "react";

const House = ({ width = 22, height = 22, stroke = "white" }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 22 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4.125 16V19.125C4.125 19.8154 4.68464 20.375 5.375 20.375H9.125V15.375C9.125 14.6846 9.68464 14.125 10.375 14.125H11.625C12.3154 14.125 12.875 14.6846 12.875 15.375V20.375H16.625C17.3154 20.375 17.875 19.8154 17.875 19.125V16"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M1.625 14.7498L10.1158 6.25898C10.3503 6.02438 10.6683 5.89258 11 5.89258C11.3317 5.89258 11.6497 6.02438 11.8842 6.25898L20.375 14.7498"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14.75 9.125V7.875H17.875V12.25"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15.2685 1.625L14.9293 2.0775C14.6464 2.44781 14.7052 2.97521 15.0627 3.27417V3.27417C15.4201 3.57313 15.4789 4.10052 15.196 4.47083L14.8568 4.92333"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.3935 1.625L18.0543 2.0775C17.7714 2.44781 17.8302 2.97521 18.1877 3.27417V3.27417C18.5451 3.57313 18.6039 4.10052 18.321 4.47083L17.9818 4.92333"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default House;
