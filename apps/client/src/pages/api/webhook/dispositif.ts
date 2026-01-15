import { ContentType, DispositifStatus } from "@refugies-info/api-types";
import crypto from "crypto";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "~/lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const secret = req.headers["webhook-secret"];
  const expectedSecret = process.env.WEBHOOK_SECRET;

  if (!secret || !expectedSecret || typeof secret !== "string") {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Use timing-safe comparison to prevent timing attacks
  const secretBuffer = Buffer.from(secret);
  const expectedBuffer = Buffer.from(expectedSecret);

  if (
    secretBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(secretBuffer, expectedBuffer)
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { email, dispositif } = req.body;

  if (!email || !dispositif) {
    return res.status(400).json({ message: "Missing email or dispositif data" });
  }

  try {
    const conn = await dbConnect();

    // User Lookup
    const User =
      conn.models.User ||
      conn.model("User", new mongoose.Schema({}, { strict: false, collection: "users" }));
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Dispositif Creation/Update
    // We use a loose schema as requested to avoid importing from apps/server
    const Dispositif =
      conn.models.Dispositif ||
      conn.model(
        "Dispositif",
        new mongoose.Schema({}, { strict: false, collection: "dispositifs" }),
      );

    // UPDATE: If _id is provided, update existing document
    if (dispositif._id) {
      // Prepare update payload, preserving original creator and creation date
      const { _id, creatorId, created_at, origin, ...dispositifWithoutId } = dispositif;
      const updatePayload = {
        ...dispositifWithoutId,
        lastModificationDate: new Date(),
        lastModificationAuthor: user._id,
        // Update translations while preserving structure
        translations: {
          ...(dispositif.translations || {}),
          fr: {
            ...(dispositif.translations?.fr || {}),
            content: dispositif.translations?.fr?.content || {},
            validatorId: user._id,
          },
        },
      };

      const updatedDispositif = await Dispositif.findByIdAndUpdate(_id, {
        $set: updatePayload,
      });

      if (!updatedDispositif) {
        return res.status(404).json({ message: "Dispositif not found" });
      }

      return res.status(200).json({
        message: "Dispositif updated successfully",
        id: _id,
      });
    }

    // CREATE: No _id provided, create new document
    const newDispositif = {
      ...dispositif,
      creatorId: user._id,
      status: dispositif.status || DispositifStatus.DRAFT,
      typeContenu: dispositif.typeContenu || ContentType.DISPOSITIF,
      created_at: new Date(),
      lastModificationDate: new Date(),
      lastModificationAuthor: user._id,
      // Ensure translations structure exists if partially provided
      translations: {
        ...dispositif.translations,
        fr: {
          content: dispositif.translations?.fr?.content || {},
          created_at: new Date(),
          validatorId: user._id,
        },
      },
    };

    const createdDispositif = await Dispositif.create(newDispositif);

    return res.status(201).json({
      message: "Dispositif created successfully",
      id: createdDispositif._id,
    });
  } catch (error: unknown) {
    console.error("[Webhook] Error creating dispositif:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return res.status(500).json({ message: "Internal Server Error", error: errorMessage });
  }
};

export default handler;
