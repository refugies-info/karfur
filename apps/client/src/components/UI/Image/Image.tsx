"use client";

import NextImage, { ImageLoader } from "next/image";
import { forwardRef } from "react";

// Demo: https://res.cloudinary.com/demo/image/upload/w_300,c_limit,q_auto/turtles.jpg
export const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const params = ["f_auto", "c_limit", `w_${width}`, `q_${quality || "auto"}`];
  return `https://res.cloudinary.com/dlmqnnhp6/image/upload/${params.join(",")}${src}`;
};

export const Image: typeof NextImage = forwardRef(({ src, loader, ...props }, ref) => {
  const realLoader =
    typeof loader !== "undefined"
      ? loader
      : typeof src === "string" && src.includes("res.cloudinary.com")
        ? cloudinaryLoader
        : undefined; // Use default loader
  return <NextImage src={src} loader={realLoader} {...props} ref={ref} />;
});

Image.displayName = "Image";
