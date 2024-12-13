"use client";

import NextImage, { ImageLoader } from "next/image";
import { forwardRef } from "react";

// Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
export const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
  if (src.startsWith("/")) {
    return `https://res.cloudinary.com/dlmqnnhp6/image/upload/${params.join(",")}${src}`;
  }
  const parts = src.split("/upload/");
  return `${parts[0]}/upload/${params.join(",")}/${parts[1]}`;
};

export const Image: typeof NextImage = forwardRef(({ src, loader, ...props }, ref) => {
  const realLoader =
    typeof loader !== "undefined"
      ? loader
      : typeof src === "string" && src.startsWith("http") && new URL(src).hostname === "res.cloudinary.com"
        ? cloudinaryLoader
        : undefined; // Use default loader
  return <NextImage src={src} loader={realLoader} {...props} ref={ref} />;
});

Image.displayName = "Image";
