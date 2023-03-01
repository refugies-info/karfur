import { TranslationContent } from "api-types";
import { RecursivePartial } from "../types/interface";
import { Traductions } from "./Traductions";

const trad: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: { "my-uuid-v4-key": { title: "title", text: "text" }, "my-uuid-v4-key-2": { title: "title", text: "text" } },
  },
  metadatas: {
    important: "truc",
  },
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
  },
  metadatas: {
    important: "truc",
    duration: "truc",
  },
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
  },
  metadatas: {
    important: "truc",
  },
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
  },
  metadatas: {
    important: "truc",
  },
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
  },
  metadatas: {
    important: "modified truc",
    duration: "modified duration",
  },
};

const trad_complete: TranslationContent = {
  content: {
    titreInformatif: "abc",
    titreMarque: "def",
    abstract: "tyui",
    what: "WHAT",
    how: { "my-uuid-v4-key": { title: "title", text: "text" } },
    next: { "my-uuid-v4-key": { title: "title", text: "text" }, "my-uuid-v4-key-2": { title: "title", text: "text" } },
  },
  metadatas: {
    important: "truc",
    duration: "truc",
  },
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
};

describe("Traductions", () => {
  describe("diff", () => {
    it("should return empty array", () => {
      expect(Traductions.diff(trad, trad)).toEqual({ added: [], removed: [], modified: [] });
    });
    it("should return added sections", () => {
      expect(Traductions.diff(trad, trad_added)).toEqual({
        added: ["content.next.my-uuid-v4-key-3.title", "content.next.my-uuid-v4-key-3.text", "metadatas.duration"],
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
          "metadatas.important",
        ],
        added: ["content.how.my-uuid-v4-key-2.title", "content.how.my-uuid-v4-key-2.text", "metadatas.duration"],
        removed: ["content.next.my-uuid-v4-key.title", "content.next.my-uuid-v4-key.text"],
      });
    });
  });

  describe("computeAvancement", () => {
    it("should return 1.00 avancement", () => {
      // @ts-ignore because we inject a partial Dispositif & partial Traductions
      expect(Traductions.computeAvancement({ translations: { fr: trad } }, { translated: trad })).toEqual(1);
    });
    it("should return 0 avancement", () => {
      // @ts-ignore because we inject a partial Dispositif & partial Traductions
      expect(Traductions.computeAvancement({ translations: { fr: trad } }, { translated: { content: {} } })).toEqual(0);
    });
    it("should return 0.5 avancement", () => {
      expect(
        // @ts-ignore because we inject a partial Dispositif & partial Traductions
        Traductions.computeAvancement({ translations: { fr: trad_complete } }, { translated: trad_avancement }),
      ).toEqual(0.5);
    });
  });
});
