import React from "react";

const Office = ({width = 22, height = 22, stroke = "white"}) => (
<svg width={width} height={height} viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fillRule="evenodd" clipRule="evenodd" d="M20.4051 11.3607C20.4531 11.1165 20.3895 10.8636 20.2316 10.6712C20.0737 10.4788 19.8381 10.3671 19.5892 10.3665H9.73255C9.33712 10.3658 8.99664 10.0873 8.91755 9.69986L8.68672 8.54069C8.60763 8.15325 8.26715 7.87473 7.87172 7.87402H2.50005C2.25176 7.87556 2.01709 7.98774 1.85996 8.18C1.70284 8.37225 1.63963 8.62456 1.68755 8.86819L3.84839 19.7057C3.92747 20.0931 4.26796 20.3716 4.66339 20.3724H17.9276C18.323 20.3716 18.6635 20.0931 18.7426 19.7057C19.0834 17.9915 20.0001 13.3899 20.4051 11.3607Z" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M4.79688 5.37305L4.81354 2.45638C4.81354 1.99614 5.18664 1.62305 5.64688 1.62305H16.4485C16.9088 1.62305 17.2819 1.99614 17.2819 2.45638L17.2994 7.87305" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M7.30664 4.11621L14.1716 4.12288" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M11.0469 6.62305H14.1719" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>
)
export default Office;