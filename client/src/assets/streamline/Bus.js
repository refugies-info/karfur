import React from "react";

const Bus = ({width = 22, height = 22, stroke = "white"}) => (
    <svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5.375 17.79V19.0934C5.375 19.7837 5.93464 20.3434 6.625 20.3434C7.31536 20.3434 7.875 19.7837 7.875 19.0934V17.8434" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M16.625 17.79V19.0934C16.625 19.7837 16.0654 20.3434 15.375 20.3434C14.6846 20.3434 14.125 19.7837 14.125 19.0934V17.8434" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M4.125 5.34375H2.875C2.18464 5.34375 1.625 5.90339 1.625 6.59375V9.09375" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17.875 5.34375H19.125C19.8154 5.34375 20.375 5.90339 20.375 6.59375V9.09375" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<rect x="4.125" y="1.59375" width="13.75" height="16.25" rx="2" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M17.875 12.8438H4.125" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M12.875 15.3438H15.375" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M6.625 15.3438H9.125" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M9.125 4.09375H12.875" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)

export default Bus;