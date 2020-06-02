import React from "react";

const Elearning = ({width = 22, height = 22, stroke = "white"}) => (
<svg
  xmlns="http://www.w3.org/2000/svg"
  version="1.1"
  viewBox="0 0 20 20"
  width={width}
  height={height}
>
  <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
    <path
      d="M20.25,5.251v9a1.5,1.5,0,0,1-1.5,1.5H5.25a1.5,1.5,0,0,1-1.5-1.5v-9"
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></path>
    <path
      d="M21.748,23.251H2.252A1.5,1.5,0,0,1,.91,21.081L2.746,17.41a3,3,0,0,1,2.683-1.659H18.571a3,3,0,0,1,2.683,1.659l1.836,3.671A1.5,1.5,0,0,1,21.748,23.251Z"
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></path>
    <path
      d="M10.5 20.251L13.5 20.251"
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></path>
    <path
      d="M12,2.412s.477-1.5,4.561-1.66a.635.635,0,0,1,.689.585V7.511a.634.634,0,0,1-.656.58C12.484,8.238,12,9.751,12,9.751V2.412S11.523.907,7.439.752a.635.635,0,0,0-.689.585V7.511a.634.634,0,0,0,.656.58C11.516,8.238,12,9.751,12,9.751"
      fill="none"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
    ></path>
  </g>
</svg>)

export default Elearning;