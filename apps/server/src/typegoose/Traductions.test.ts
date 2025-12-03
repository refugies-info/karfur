import { ObjectId } from "~/typegoose";
import type { RecursivePartial } from "~/types/interface";
import type { TranslationContent } from "./Dispositif";
import { Traductions } from "./Traductions";

const trad: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: {
      "my-uuid-v4-key": { title: "title", text: "text" },
      "my-uuid-v4-key-2": { title: "title", text: "text" },
    },
    administrationName: "France Travail",
  },

  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};

const trad_added: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: {
      "my-uuid-v4-key": { title: "title", text: "text" },
      "my-uuid-v4-key-2": { title: "title", text: "text" },
      "my-uuid-v4-key-3": { title: "title", text: "text" },
    },
    administrationName: "France Travail",
  },

  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};

const trad_removed: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: {
      "my-uuid-v4-key": { title: "title", text: "text" },
    },
    administrationName: "France Travail",
  },

  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};

const trad_modified: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: {
      "my-uuid-v4-key": { title: "title", text: "text" },
      "my-uuid-v4-key-2": { title: "new title", text: "new text" },
    },
    administrationName: "France Travail",
  },

  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};

const trad_mixed: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def brand",
    abstract: "tyui",
    what: "WHAT",
    how: {
      "my-uuid-v4-key": { title: "title", text: "text" },
      "my-uuid-v4-key-2": { title: "title", text: "text" },
    },
    next: {
      "my-uuid-v4-key-2": { title: "new title", text: "new text" },
    },
    administrationName: "France Travail",
  },

  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};

const trad_complete: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: {
      "my-uuid-v4-key": { title: "title", text: "text" },
      "my-uuid-v4-key-2": { title: "title", text: "text" },
    },
    administrationName: "France Travail",
  },

  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};
const trad_avancement: RecursivePartial<TranslationContent> = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    next: {
      "my-uuid-v4-key-2": { title: "title", text: "jsdhbgfkh" },
    },
  },
  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};

const trad_added_adminName = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: {
      "my-uuid-v4-key": { title: "title", text: "text" },
      "my-uuid-v4-key-2": { title: "title", text: "text" },
      "my-uuid-v4-key-3": { title: "title", text: "text" },
    },
  },

  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};

const trad_adminNameNull: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: {
      "my-uuid-v4-key": { title: "title", text: "text" },
      "my-uuid-v4-key-2": { title: "title", text: "text" },
    },
    administrationName: null,
  },

  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};

const trad_adminNameNull_en: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    why: {},
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: {
      "my-uuid-v4-key": { title: "title", text: "text" },
      "my-uuid-v4-key-2": { title: "title", text: "text" },
    },
  },

  created_at: new Date(),
  validatorId: new ObjectId("656076dbaf8df7a3f7bceeb4"),
};

describe("Traductions", () => {
  describe("diff", () => {
    it("should return empty array", () => {
      expect(Traductions.diff(trad, trad)).toEqual({ added: [], removed: [], modified: [] });
    });
    it("should return added sections", () => {
      expect(Traductions.diff(trad, trad_added)).toEqual({
        added: ["content.next.my-uuid-v4-key-3.title", "content.next.my-uuid-v4-key-3.text"],
        removed: [],
        modified: [],
      });
    });
    it("should return removed sections", () => {
      expect(Traductions.diff(trad, trad_removed)).toEqual({
        removed: ["content.next.my-uuid-v4-key-2.title", "content.next.my-uuid-v4-key-2.text"],
        added: [],
        modified: [],
      });
    });
    it("should return modified sections", () => {
      expect(Traductions.diff(trad, trad_modified)).toEqual({
        modified: ["content.next.my-uuid-v4-key-2.title", "content.next.my-uuid-v4-key-2.text"],
        added: [],
        removed: [],
      });
    });
    it("should return modified, added and removed sections", () => {
      expect(Traductions.diff(trad, trad_mixed)).toEqual({
        modified: [
          "content.titreMarque",
          "content.next.my-uuid-v4-key-2.title",
          "content.next.my-uuid-v4-key-2.text",
        ],
        added: ["content.how.my-uuid-v4-key-2.title", "content.how.my-uuid-v4-key-2.text"],
        removed: ["content.next.my-uuid-v4-key.title", "content.next.my-uuid-v4-key.text"],
      });
    });
    it("should not return administrationName ", () => {
      const newTradAdded = JSON.parse(JSON.stringify(trad_added_adminName));
      newTradAdded.content = { ...newTradAdded.content, administrationName: null };
      //@ts-expect-error because we don't need administrationName for this test
      expect(Traductions.diff(trad_added_adminName, newTradAdded)).toEqual({
        modified: [],
        added: [],
        removed: [],
      });
    });
  });

  describe("computeFinished", () => {
    it("should return true", () => {
      expect(
        Traductions.computeFinished(
          { translations: { fr: trad } } as any,
          { translated: trad } as any,
        ),
      ).toEqual(true);
    });
    it("should return false", () => {
      expect(
        Traductions.computeFinished(
          { translations: { fr: trad } } as any,
          { translated: { content: {} } } as any,
        ),
      ).toEqual(false);
    });
    it("should return false", () => {
      expect(
        Traductions.computeFinished(
          { translations: { fr: trad_complete } } as any,
          { translated: trad_avancement } as any,
        ),
      ).toEqual(false);
    });
    it("should return true", () => {
      expect(
        Traductions.computeFinished(
          { translations: { fr: trad_adminNameNull } } as any,
          { translated: trad_adminNameNull_en } as any,
        ),
      ).toEqual(true);
    });
  });
});
