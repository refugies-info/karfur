import { DispositifStatus, RoleName, StructureStatus } from "@refugies-info/api-types";
import type { MigrationInterface } from "mongo-migrate-ts";
import type { Db, Document, PullOperator } from "mongodb";

/**
 * Migration: fix documents that do not comply with their Mongoose schema.
 *
 * Found by validating every document of the production snapshot against the models of
 * @refugies-info/mongo. Only the cases with a safe, known value are fixed here:
 *
 * - dispositifs_draft: creatorId / typeContenu are taken from the published dispositif that shares
 *   the draft's _id, a missing status becomes "Brouillon" (the most common draft status, and the
 *   only one that does not put the draft in the admins' validation queue);
 * - dispositifs (Actif): a missing lastModificationAuthor becomes the creatorId;
 * - structures: missing nom, lowercase "actif" status, empty entries in the contact arrays and
 *   members without added_at (the structure creation date is the closest known value);
 * - roles: the newsletter role is created in lowercase by CreateNewsletterRoleAndUser1733826012000,
 *   whereas the RoleName enum (and the other role names) are capitalised;
 * - users: null entries in roles (a role id that no longer exists).
 */
const UNNAMED_STRUCTURE = "(sans nom)";
const CONTACT_ARRAYS = ["phonesPublic", "mailsPublic", "websites"] as const;
const LEGACY_NEWSLETTER_ROLE = "newsletter";
const log = (message: string) => console.log(`[Migration1791901800000] ${message}`);

export class FixSchemaCompliance1791901800000 implements MigrationInterface {
  public async up(db: Db): Promise<void | never> {
    // Drafts: complete what is missing from the published dispositif of the same _id
    const drafts = db.collection("dispositifs_draft");
    const incompleteDrafts = await drafts
      .find({
        $or: [{ creatorId: null }, { typeContenu: null }, { status: null }],
      })
      .toArray();
    let fixedDrafts = 0;
    for (const draft of incompleteDrafts) {
      const published = await db
        .collection("dispositifs")
        .findOne({ _id: draft._id }, { projection: { creatorId: 1, typeContenu: 1 } });
      const fields: Record<string, unknown> = {};
      if (draft.creatorId == null && published?.creatorId) fields.creatorId = published.creatorId;
      if (draft.typeContenu == null && published?.typeContenu) {
        fields.typeContenu = published.typeContenu;
      }
      if (draft.status == null) fields.status = DispositifStatus.DRAFT;
      if (Object.keys(fields).length === 0) continue;
      await drafts.updateOne({ _id: draft._id }, { $set: fields });
      fixedDrafts++;
    }
    log(`dispositifs_draft: completed ${fixedDrafts} draft(s)`);

    // Active dispositifs: the creator is the best known author
    const activeResult = await db
      .collection("dispositifs")
      .updateMany(
        { status: DispositifStatus.ACTIVE, lastModificationAuthor: null, creatorId: { $ne: null } },
        [{ $set: { lastModificationAuthor: "$creatorId" } }],
      );
    log(`dispositifs: set lastModificationAuthor on ${activeResult.modifiedCount} active one(s)`);

    // Structures
    const structures = db.collection("structures");
    const unnamed = await structures.updateMany(
      { $or: [{ nom: null }, { nom: "" }] },
      { $set: { nom: UNNAMED_STRUCTURE } },
    );
    log(`structures: named ${unnamed.modifiedCount} unnamed structure(s)`);

    const status = await structures.updateMany(
      { status: "actif" },
      { $set: { status: StructureStatus.ACTIVE } },
    );
    log(`structures: fixed the status of ${status.modifiedCount} structure(s)`);

    for (const field of CONTACT_ARRAYS) {
      const result = await structures.updateMany(
        { [field]: { $elemMatch: { $in: ["", null] } } },
        { $pull: { [field]: { $in: ["", null] } } as PullOperator<Document> },
      );
      log(`structures: removed empty ${field} entries on ${result.modifiedCount} structure(s)`);
    }

    const withoutAddedAt = await structures
      .find(
        { membres: { $elemMatch: { added_at: { $exists: false } } } },
        { projection: { created_at: 1 } },
      )
      .toArray();
    for (const structure of withoutAddedAt) {
      await structures.updateOne(
        { _id: structure._id },
        {
          $set: {
            "membres.$[member].added_at": structure.created_at ?? structure._id.getTimestamp(),
          },
        },
        { arrayFilters: [{ "member.added_at": { $exists: false } }] },
      );
    }
    log(`structures: set added_at on the members of ${withoutAddedAt.length} structure(s)`);

    // Roles: align the newsletter role with the RoleName enum
    const role = await db
      .collection("roles")
      .updateOne({ nom: LEGACY_NEWSLETTER_ROLE }, { $set: { nom: RoleName.NEWSLETTER } });
    log(`roles: renamed ${role.modifiedCount} newsletter role`);

    // Users
    const roles = await db
      .collection("users")
      .updateMany({ roles: { $elemMatch: { $eq: null } } }, [
        { $set: { roles: { $filter: { input: "$roles", cond: { $ne: ["$$this", null] } } } } },
      ]);
    log(`users: removed null roles on ${roles.modifiedCount} user(s)`);
  }

  // Not reversible: the previous invalid values are not kept. Restore from the Mongo backup.
  public async down(): Promise<void | never> {}
}
