import { ContentType, DispositifStatus } from "@refugies-info/api-types";
import mongoose from "mongoose";
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "~/lib/db";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const secret = req.headers["webhook-secret"];
  if (secret !== process.env.WEBHOOK_SECRET) {
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

    // Dispositif Creation
    // We use a loose schema as requested to avoid importing from apps/server
    const Dispositif =
      conn.models.Dispositif ||
      conn.model(
        "Dispositif",
        new mongoose.Schema({}, { strict: false, collection: "dispositifs" }),
      );

    // Basic default fields if not present in payload, similar to createDispositif
    const newDispositif = {
      ...dispositif,
      creatorId: user._id,
      status: DispositifStatus.DRAFT,
      typeContenu: dispositif.typeContenu || ContentType.DISPOSITIF,
      created_at: new Date(),
      lastModificationDate: new Date(),
      lastModificationAuthor: user._id,
      // Ensure translations structure exists if partially provided
      translations: {
        fr: {
          content: dispositif.translations?.fr?.content || {},
          created_at: new Date(),
          validatorId: user._id,
        },
        ...dispositif.translations,
      },
    };

    const createdDispositif = await Dispositif.create(newDispositif);

    return res.status(201).json({
      message: "Dispositif created successfully",
      id: createdDispositif._id,
    });
  } catch (error: any) {
    console.error("[Webhook] Error creating dispositif:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export default handler;
