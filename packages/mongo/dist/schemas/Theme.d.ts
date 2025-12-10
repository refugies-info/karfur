import { type Document, Types } from "mongoose";
import { z } from "zod";
import type { ThemeGradientColors } from "@refugies-info/api-types";
import { type Image } from "./generics";
import type { Langue } from "./Langue";
export declare const ThemeZodSchema: z.ZodObject<
  {
    name: z.ZodRecord<z.ZodString, z.ZodString>;
    short: z.ZodRecord<z.ZodString, z.ZodString>;
    mainColor: z.ZodString;
    colors: z.ZodObject<
      {
        color100: z.ZodString;
        color80: z.ZodString;
        color60: z.ZodString;
        color40: z.ZodString;
        color30: z.ZodString;
      },
      "strip",
      z.ZodTypeAny,
      {
        color100: string;
        color80: string;
        color60: string;
        color40: string;
        color30: string;
      },
      {
        color100: string;
        color80: string;
        color60: string;
        color40: string;
        color30: string;
      }
    >;
    gradientColors: z.ZodObject<
      {
        colorTop: z.ZodString;
        colorBottom: z.ZodString;
      },
      "strip",
      z.ZodTypeAny,
      {
        colorTop: string;
        colorBottom: string;
      },
      {
        colorTop: string;
        colorBottom: string;
      }
    >;
    position: z.ZodNumber;
    icon: z.ZodAny;
    banner: z.ZodAny;
    appBanner: z.ZodAny;
    appImage: z.ZodAny;
    shareImage: z.ZodAny;
    dispositifImage: z.ZodAny;
    demarcheImage: z.ZodAny;
    notificationEmoji: z.ZodString;
    adminComments: z.ZodOptional<z.ZodString>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: Record<string, string>;
    short: Record<string, string>;
    mainColor: string;
    colors: {
      color100: string;
      color80: string;
      color60: string;
      color40: string;
      color30: string;
    };
    gradientColors: {
      colorTop: string;
      colorBottom: string;
    };
    position: number;
    notificationEmoji: string;
    icon?: any;
    banner?: any;
    appBanner?: any;
    appImage?: any;
    shareImage?: any;
    dispositifImage?: any;
    demarcheImage?: any;
    adminComments?: string | undefined;
  },
  {
    name: Record<string, string>;
    short: Record<string, string>;
    mainColor: string;
    colors: {
      color100: string;
      color80: string;
      color60: string;
      color40: string;
      color30: string;
    };
    gradientColors: {
      colorTop: string;
      colorBottom: string;
    };
    position: number;
    notificationEmoji: string;
    icon?: any;
    banner?: any;
    appBanner?: any;
    appImage?: any;
    shareImage?: any;
    dispositifImage?: any;
    demarcheImage?: any;
    adminComments?: string | undefined;
  }
>;
export declare const ThemeZodSchemaFinal: z.ZodObject<
  {
    name: z.ZodRecord<z.ZodString, z.ZodString>;
    short: z.ZodRecord<z.ZodString, z.ZodString>;
    mainColor: z.ZodString;
    colors: z.ZodObject<
      {
        color100: z.ZodString;
        color80: z.ZodString;
        color60: z.ZodString;
        color40: z.ZodString;
        color30: z.ZodString;
      },
      "strip",
      z.ZodTypeAny,
      {
        color100: string;
        color80: string;
        color60: string;
        color40: string;
        color30: string;
      },
      {
        color100: string;
        color80: string;
        color60: string;
        color40: string;
        color30: string;
      }
    >;
    gradientColors: z.ZodObject<
      {
        colorTop: z.ZodString;
        colorBottom: z.ZodString;
      },
      "strip",
      z.ZodTypeAny,
      {
        colorTop: string;
        colorBottom: string;
      },
      {
        colorTop: string;
        colorBottom: string;
      }
    >;
    position: z.ZodNumber;
    icon: z.ZodOptional<
      z.ZodObject<
        {
          secure_url: z.ZodString;
          public_id: z.ZodNullable<z.ZodString>;
          imgId: z.ZodNullable<z.ZodString>;
        },
        "strip",
        z.ZodTypeAny,
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        },
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      >
    >;
    banner: z.ZodOptional<
      z.ZodObject<
        {
          secure_url: z.ZodString;
          public_id: z.ZodNullable<z.ZodString>;
          imgId: z.ZodNullable<z.ZodString>;
        },
        "strip",
        z.ZodTypeAny,
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        },
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      >
    >;
    appBanner: z.ZodOptional<
      z.ZodObject<
        {
          secure_url: z.ZodString;
          public_id: z.ZodNullable<z.ZodString>;
          imgId: z.ZodNullable<z.ZodString>;
        },
        "strip",
        z.ZodTypeAny,
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        },
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      >
    >;
    appImage: z.ZodOptional<
      z.ZodObject<
        {
          secure_url: z.ZodString;
          public_id: z.ZodNullable<z.ZodString>;
          imgId: z.ZodNullable<z.ZodString>;
        },
        "strip",
        z.ZodTypeAny,
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        },
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      >
    >;
    shareImage: z.ZodOptional<
      z.ZodObject<
        {
          secure_url: z.ZodString;
          public_id: z.ZodNullable<z.ZodString>;
          imgId: z.ZodNullable<z.ZodString>;
        },
        "strip",
        z.ZodTypeAny,
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        },
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      >
    >;
    dispositifImage: z.ZodOptional<
      z.ZodObject<
        {
          secure_url: z.ZodString;
          public_id: z.ZodNullable<z.ZodString>;
          imgId: z.ZodNullable<z.ZodString>;
        },
        "strip",
        z.ZodTypeAny,
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        },
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      >
    >;
    demarcheImage: z.ZodOptional<
      z.ZodObject<
        {
          secure_url: z.ZodString;
          public_id: z.ZodNullable<z.ZodString>;
          imgId: z.ZodNullable<z.ZodString>;
        },
        "strip",
        z.ZodTypeAny,
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        },
        {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      >
    >;
    notificationEmoji: z.ZodString;
    adminComments: z.ZodOptional<z.ZodString>;
    created_at: z.ZodOptional<z.ZodDate>;
    updatedAt: z.ZodOptional<z.ZodDate>;
  },
  "strip",
  z.ZodTypeAny,
  {
    name: Record<string, string>;
    short: Record<string, string>;
    mainColor: string;
    colors: {
      color100: string;
      color80: string;
      color60: string;
      color40: string;
      color30: string;
    };
    gradientColors: {
      colorTop: string;
      colorBottom: string;
    };
    position: number;
    notificationEmoji: string;
    created_at?: Date | undefined;
    updatedAt?: Date | undefined;
    icon?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    banner?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    appBanner?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    appImage?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    shareImage?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    dispositifImage?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    demarcheImage?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    adminComments?: string | undefined;
  },
  {
    name: Record<string, string>;
    short: Record<string, string>;
    mainColor: string;
    colors: {
      color100: string;
      color80: string;
      color60: string;
      color40: string;
      color30: string;
    };
    gradientColors: {
      colorTop: string;
      colorBottom: string;
    };
    position: number;
    notificationEmoji: string;
    created_at?: Date | undefined;
    updatedAt?: Date | undefined;
    icon?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    banner?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    appBanner?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    appImage?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    shareImage?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    dispositifImage?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    demarcheImage?:
      | {
          secure_url: string;
          public_id: string | null;
          imgId: string | null;
        }
      | undefined;
    adminComments?: string | undefined;
  }
>;
export type ThemeType = z.infer<typeof ThemeZodSchemaFinal>;
export interface ThemeColors {
  color100: string;
  color80: string;
  color60: string;
  color40: string;
  color30: string;
}
export interface Theme extends Document {
  _id: Types.ObjectId;
  name: Record<string, string>;
  short: Record<string, string>;
  mainColor: string;
  colors: ThemeColors;
  gradientColors: ThemeGradientColors;
  position: number;
  icon?: Image;
  banner?: Image;
  appBanner?: Image;
  appImage?: Image;
  shareImage?: Image;
  dispositifImage?: Image;
  demarcheImage?: Image;
  notificationEmoji: string;
  adminComments?: string;
  created_at?: Date;
  updatedAt?: Date;
  isActive(activeLanguages: Langue[]): boolean;
}
export type ThemeId = Theme["_id"] | Theme["id"];
export declare const ThemeModel: import("mongoose").Model<
  Theme,
  {},
  {},
  {},
  Document<unknown, {}, Theme, {}, {}> &
    Theme &
    Required<{
      _id: Types.ObjectId;
    }> & {
      __v: number;
    },
  any
>;
//# sourceMappingURL=Theme.d.ts.map
