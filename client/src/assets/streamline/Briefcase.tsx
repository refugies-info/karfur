import React from "react";

const Briefcase = ({width = 22, height = 20, stroke = "white"}) => (<svg width={width} height={height} viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M1.625 6.5C1.625 5.67157 2.29657 5 3.125 5H18.875C19.7034 5 20.375 5.67157 20.375 6.5V17.25C20.375 18.0784 19.7034 18.75 18.875 18.75H3.125C2.29657 18.75 1.625 18.0784 1.625 17.25V6.5Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M5.375 9.375H16.625" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M5.375 14.375H16.625" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path fillRule="evenodd" clipRule="evenodd" d="M13.785 2.10417C13.6147 1.59396 13.1371 1.24993 12.5992 1.25H9.40083C8.86295 1.24993 8.38533 1.59396 8.215 2.10417L7.25 5H14.75L13.785 2.10417Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M4.125 5V3.75" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17.875 5V3.75" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>)

export default Briefcase;