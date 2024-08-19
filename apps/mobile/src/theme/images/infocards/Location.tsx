import React from "react";
import { IconProps } from "./IconProps";
import { Path, Svg } from "react-native-svg";

const Location = ({ color, width = 32, height = 32 }: IconProps) => (
  <Svg width={width} height={height} viewBox="0 0 56 56" fill="none">
    <Path
      d="M11.3274 24.162C11.9557 26.0819 13.0413 26.83 14.4129 28.5659C15.1278 29.4022 15.2895 30.5863 14.8248 31.5833C13.8208 33.7418 13.9854 36.7847 13.7345 38.9271C13.5355 40.623 12.9835 42.3581 12.0467 44.2315C10.8968 46.533 11.7687 49.3488 14.4199 50.6577C19.4166 53.0528 19.5028 53.3418 20.3312 53.3416C21.1017 53.3416 21.8578 52.905 22.208 52.1331C22.3079 51.9136 22.5932 51.8443 22.7861 52.0185C23.0257 52.2339 25.9784 54.9021 26.1272 55.0351C27.3687 56.1575 29.9252 55.8738 31.1974 55.9897C32.7588 56.1316 34.0506 54.7897 33.846 53.2334C33.7035 52.1469 34.2233 51.0875 35.1704 50.5344C36.5504 49.7282 37.7184 48.7791 39.0302 49.2739L40.3844 49.7818C40.4784 49.8171 43.5374 50.9635 43.6232 50.9953C45.306 51.6265 47.0147 51.0138 48.5904 50.6664C50.525 50.2393 51.5898 48.5691 52.6536 47.2559C53.7633 45.8878 53.4992 43.8745 52.0749 42.8383L50.9358 42.0102C50.7857 41.9011 50.6811 41.7405 50.6419 41.5596L50.1418 39.2397C50.0715 38.9156 50.2265 38.578 50.5186 38.4187C51.7943 37.7228 52.1903 36.0706 51.3599 34.8709C51.1117 34.4602 50.7281 34.1836 50.7976 33.7203L50.9468 32.7241C51.1485 31.3819 50.0585 30.2006 48.7066 30.2886C48.3839 30.3098 48.1568 29.9803 48.2869 29.687L50.4059 24.9205C50.6009 24.481 51.037 24.2045 51.5195 24.2165C53.0334 24.2554 54.3451 23.1011 54.4649 21.5577C54.8001 17.8844 54.6413 17.7331 54.9626 17.3149C56.1581 15.7521 55.3577 13.4753 53.448 13.0028L50.3051 12.227C49.7866 12.0986 49.7377 11.7916 48.3536 10.3321C47.6439 9.54737 46.8946 9.48809 45.9566 9.32304C43.6139 8.91094 43.5786 8.87858 41.1282 7.3659L41.1271 7.36533C39.6812 6.53908 39.4677 5.96894 37.4351 3.75138C35.9302 2.05442 33.578 1 31.2965 1H30.0849C29.0467 1 28.1683 1.77637 28.0418 2.8042L27.6865 5.6428C27.598 6.35254 27.0386 6.90198 26.3272 6.97879C24.8301 7.13818 23.8897 7.23502 22.7971 8.36195C22.786 8.37337 22.7495 8.41172 22.7606 8.4003C22.6647 8.50098 22.5985 8.56727 22.5378 8.68186C22.2303 9.26207 21.5228 9.4985 20.9279 9.22044C20.9279 9.22044 17.3528 7.54531 17.309 7.52472C15.2781 6.57347 12.8683 8.7003 13.6535 10.8426L14.4771 13.0925C14.5808 13.376 14.3165 13.6506 14.0317 13.5646C8.42724 11.8707 8.60281 11.8508 7.98018 11.9705L4.61725 12.6112C2.51078 13.0124 1.37887 15.3213 2.35399 17.2328C2.79438 18.0974 3.16339 18.7923 4.21996 19.2423L8.47995 21.0545C9.81334 21.6219 10.8554 22.7381 11.3274 24.162ZM54.9336 17.351C54.8892 17.4059 54.8256 17.4636 54.747 17.5135C54.8161 17.4692 54.8791 17.4145 54.9336 17.351ZM11.2954 24.0286C11.2986 24.05 11.3028 24.0713 11.3078 24.0923C11.3042 24.0775 11.2996 24.0557 11.2954 24.0286Z"
      fill={color}
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M39.9174 30.8868V29.3805C39.651 27.5461 39.1537 24.6538 38.4219 22.515C37.4924 19.7983 34.6485 15.1369 33.5707 13.4159C32.5817 12.0273 32 10.3285 32 8.49388C32 3.80284 35.8028 0 40.4939 0C45.1849 0 48.9878 3.80284 48.9878 8.49388C48.9878 10.3304 48.4049 12.0307 47.4141 13.4201C46.3018 15.1805 43.4503 19.8181 42.5275 22.515C41.7958 24.6538 41.2984 27.5461 41.032 29.3805V30.8868H39.9174Z"
      fill="#F9AA38"
    />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M40.494 12.354C42.1998 12.354 43.5826 10.9711 43.5826 9.2653C43.5826 7.55947 42.1998 6.17662 40.494 6.17662C38.7881 6.17662 37.4053 7.55947 37.4053 9.2653C37.4053 10.9711 38.7881 12.354 40.494 12.354Z"
      fill="white"
    />
  </Svg>
);
export default Location;
