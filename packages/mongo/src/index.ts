import { extendZod } from "@zodyac/zod-mongoose";
import { z } from "zod";

extendZod(z);

export { DispositifStatus } from "@refugies-info/api-types";
export * from "./schemas/AdminOptions";
export * from "./schemas/AppUser";
export * from "./schemas/Dispositif";
export * from "./schemas/Error";
export * from "./schemas/generics";
export type { CloudinaryImage, CloudinaryImageId, CloudinaryImageType } from "./schemas/Image";
export { CloudinaryImageModel } from "./schemas/Image";
export * from "./schemas/Indicator";
export * from "./schemas/Langue";
export * from "./schemas/Log";
export * from "./schemas/MailEvent";
export * from "./schemas/Need";
export * from "./schemas/Notification";
export * from "./schemas/Role";
export * from "./schemas/Snapshot";
export * from "./schemas/Structure";
export * from "./schemas/Theme";
export * from "./schemas/Traductions";
export * from "./schemas/User";
export * from "./schemas/Widget";
