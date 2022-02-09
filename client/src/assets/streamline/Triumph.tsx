import React from "react";

const Triumph = ({width = 22, height = 20, stroke = "white"}) => (
<svg width={width} height={height} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M2.875 3.75V17.5C2.875 18.1904 3.43464 18.75 4.125 18.75H6.625C7.31536 18.75 7.875 18.1904 7.875 17.5V11.875C7.875 10.1491 9.27411 8.75 11 8.75C12.7259 8.75 14.125 10.1491 14.125 11.875V17.5C14.125 18.1904 14.6846 18.75 15.375 18.75H17.875C18.5654 18.75 19.125 18.1904 19.125 17.5V3.75" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M1.625 6.25H20.375" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M1.625 12.5H9.125" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12.875 12.5H20.375" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M4.75 8.75H6" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16 8.75H17.25" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M5.375 15V16.25" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16.625 15V16.25" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<rect x="1.625" y="1.25" width="18.75" height="2.5" rx="0.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)

export default Triumph;