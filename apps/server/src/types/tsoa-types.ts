import mongoose from "mongoose";

/**
 * Custom parameter type for TSOA to handle MongoDB ObjectId parameters
 * This will ensure that path parameters are valid ObjectIds and return 404 if they are not
 */
export class ObjectIdParam {
  private value: mongoose.Types.ObjectId;

  constructor(value: string) {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw {
        status: 404,
        message: "Resource not found due to invalid ID format",
      };
    }
    this.value = new mongoose.Types.ObjectId(value);
  }

  toString(): string {
    return this.value.toString();
  }

  toHexString(): string {
    return this.value.toHexString();
  }

  equals(other: mongoose.Types.ObjectId | string): boolean {
    if (typeof other === "string") {
      return this.value.equals(new mongoose.Types.ObjectId(other));
    }
    return this.value.equals(other);
  }

  // Return the native ObjectId for direct use with MongoDB
  toObjectId(): mongoose.Types.ObjectId {
    return this.value;
  }

  // Allow automatic conversion to string when needed
  valueOf(): string {
    return this.value.toString();
  }
}
