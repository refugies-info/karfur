import React from "react";

const Search = ({ width = 22, height = 22, stroke = "white" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    version="1.1"
    viewBox="0 0 22 22"
    width={width}
    height={height}
  >
    <g transform="matrix(0.9166666666666666,0,0,0.9166666666666666,0,0)">
      <path
        d="M23.384,21.619,16.855,15.09a9.284,9.284,0,1,0-1.768,1.768l6.529,6.529a1.266,1.266,0,0,0,1.768,0A1.251,1.251,0,0,0,23.384,21.619ZM2.75,9.5a6.75,6.75,0,1,1,6.75,6.75A6.758,6.758,0,0,1,2.75,9.5Z"
        fill={stroke}
        stroke="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="0"
      ></path>
    </g>
  </svg>
);

export default Search;
