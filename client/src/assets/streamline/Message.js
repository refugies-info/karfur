import React from "react";

const Message = ({width = 22, height = 22, stroke = "white"}) => (
    <svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7.8525 17.5833L4.125 20.375V16.625H2.875C2.18464 16.625 1.625 16.0654 1.625 15.375V2.875C1.625 2.18464 2.18464 1.625 2.875 1.625H19.125C19.8154 1.625 20.375 2.18464 20.375 2.875V11.625" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15.375 17.875C15.2024 17.875 15.0625 18.0149 15.0625 18.1875C15.0625 18.3601 15.2024 18.5 15.375 18.5C15.5476 18.5 15.6875 18.3601 15.6875 18.1875C15.6875 18.0149 15.5476 17.875 15.375 17.875" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M15.375 16V13.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path fillRule="evenodd" clipRule="evenodd" d="M20.2192 18.2352C20.4486 18.6935 20.4242 19.238 20.1548 19.674C19.8853 20.11 19.4092 20.3754 18.8967 20.3752H11.8534C11.3408 20.3754 10.8647 20.11 10.5953 19.674C10.3258 19.238 10.3014 18.6935 10.5309 18.2352L14.0525 11.1927C14.3028 10.6916 14.8149 10.375 15.375 10.375C15.9352 10.375 16.4472 10.6916 16.6975 11.1927L20.2192 18.2352Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)

export default Message;