import type { NextApiRequest, NextApiResponse } from "next";
import { ObjectIdSchema } from "~/lib/webhookSchemas";
import {
  authorizeWebhookRequest,
  getWebhookModels,
  standardErrorResponse,
} from "~/lib/webhookUtils";

const MAX_RESULTS = 20;
const MAX_IDS = 100;

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getFirstQueryValue = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!authorizeWebhookRequest(req, res, ["GET"])) return;

  const text = getFirstQueryValue(req.query.q)?.trim();
  const ids = getFirstQueryValue(req.query.ids)
    ?.split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  if (!text && !ids?.length) {
    return res.status(400).json({ message: "Either q or ids is required" });
  }
  if (ids && (ids.length > MAX_IDS || !ids.every((id) => ObjectIdSchema.safeParse(id).success))) {
    return res.status(400).json({ message: `ids must be at most ${MAX_IDS} valid ObjectIds` });
  }

  try {
    const { Dispositif, Structure } = await getWebhookModels();

    let filter: Record<string, unknown>;
    if (ids?.length) {
      filter = { _id: { $in: ids } };
    } else if (ObjectIdSchema.safeParse(text).success) {
      filter = { _id: text };
    } else {
      const titleRegex = new RegExp(escapeRegExp(text as string), "i");
      filter = {
        status: "Actif",
        $or: [
          { "translations.fr.content.titreInformatif": titleRegex },
          { "translations.fr.content.titreMarque": titleRegex },
        ],
      };
    }

    const dispositifs = await Dispositif.find(filter)
      .limit(ids?.length ? MAX_IDS : MAX_RESULTS)
      .select(
        "typeContenu status mainSponsor translations.fr.content.titreInformatif translations.fr.content.titreMarque",
      )
      .lean();

    const sponsorIds = [
      ...new Set(
        dispositifs
          .map((d) => d.mainSponsor)
          .filter(Boolean)
          .map(String),
      ),
    ];
    const sponsors = await Structure.find({ _id: { $in: sponsorIds } })
      .select("_id nom")
      .lean();
    const sponsorNameById = new Map(sponsors.map((s) => [String(s._id), s.nom]));

    return res.status(200).json(
      dispositifs.map((dispositif) => ({
        id: String(dispositif._id),
        type: dispositif.typeContenu,
        status: dispositif.status,
        titreInformatif: dispositif.translations?.fr?.content?.titreInformatif,
        titreMarque: dispositif.translations?.fr?.content?.titreMarque,
        sponsorName: dispositif.mainSponsor
          ? sponsorNameById.get(String(dispositif.mainSponsor))
          : undefined,
      })),
    );
  } catch (error: unknown) {
    return standardErrorResponse(res, error);
  }
};

export default handler;
