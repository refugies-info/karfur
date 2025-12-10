import { Schema } from "mongoose";
import { z } from "zod";
export declare const ImageZodSchema: z.ZodObject<
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
>;
export type ImageType = z.infer<typeof ImageZodSchema>;
export interface Image extends ImageType {}
export declare const ImageSchema: Schema<
  Image,
  import("mongoose").Model<
    Image,
    any,
    any,
    any,
    import("mongoose").Document<unknown, any, Image, any, {}> &
      Image & {
        _id: import("mongoose").Types.ObjectId;
      } & {
        __v: number;
      },
    any
  >,
  {},
  {},
  {},
  {},
  import("mongoose").DefaultSchemaOptions,
  Image,
  import("mongoose").Document<
    unknown,
    {},
    import("mongoose").FlatRecord<Image>,
    {},
    import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>
  > &
    import("mongoose").FlatRecord<Image> & {
      _id: import("mongoose").Types.ObjectId;
    } & {
      __v: number;
    }
>;
//# sourceMappingURL=generics.d.ts.map
