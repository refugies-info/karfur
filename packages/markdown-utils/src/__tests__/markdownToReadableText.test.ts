import { markdownToReadableText } from "../markdownToReadableText";

describe("markdownToReadableText", () => {
  describe("empty input", () => {
    it("should return an empty string for an empty document", () => {
      expect(markdownToReadableText("")).toBe("");
    });

    it("should return an empty string for null and undefined", () => {
      expect(markdownToReadableText(null)).toBe("");
      expect(markdownToReadableText(undefined)).toBe("");
    });

    it("should return an empty string for a document with no readable content", () => {
      expect(markdownToReadableText("---\n\n***\n")).toBe("");
    });
  });

  describe("block structure", () => {
    it("should strip heading markers and end the heading with a full stop", () => {
      expect(markdownToReadableText("# Titre\n\nUn paragraphe.")).toBe("Titre. Un paragraphe.");
    });

    it("should not add a second full stop to a block that already ends a sentence", () => {
      expect(markdownToReadableText("## Comment faire ?\n\nDemandez.")).toBe(
        "Comment faire ? Demandez.",
      );
    });

    it("should not append a full stop to the last block", () => {
      expect(markdownToReadableText("Un paragraphe sans ponctuation")).toBe(
        "Un paragraphe sans ponctuation",
      );
    });

    it("should strip list markers and separate the items", () => {
      expect(markdownToReadableText("- Premier\n- Deuxième\n- Troisième")).toBe(
        "Premier. Deuxième. Troisième",
      );
    });

    it("should strip ordered list markers", () => {
      expect(markdownToReadableText("1. Premier\n2) Deuxième")).toBe("Premier. Deuxième");
    });

    it("should strip blockquote markers", () => {
      expect(markdownToReadableText("> Une citation.")).toBe("Une citation.");
    });

    it("should drop thematic breaks", () => {
      expect(markdownToReadableText("Avant.\n\n---\n\nAprès.")).toBe("Avant. Après.");
    });

    it("should normalise CRLF line endings", () => {
      expect(markdownToReadableText("# Titre\r\n\r\nUn paragraphe.")).toBe("Titre. Un paragraphe.");
    });
  });

  describe("inline syntax", () => {
    it("should keep the text of bold and italic emphasis", () => {
      expect(markdownToReadableText("Un texte **important** et *utile*.")).toBe(
        "Un texte important et utile.",
      );
    });

    it("should keep the text of underscore emphasis", () => {
      expect(markdownToReadableText("Un texte __important__ et _utile_.")).toBe(
        "Un texte important et utile.",
      );
    });

    it("should leave snake_case identifiers alone", () => {
      expect(markdownToReadableText("Le champ titre_informatif est requis.")).toBe(
        "Le champ titre_informatif est requis.",
      );
    });

    it("should keep the text of strikethrough", () => {
      expect(markdownToReadableText("Un délai de ~~trois~~ deux mois.")).toBe(
        "Un délai de trois deux mois.",
      );
    });

    it("should keep a link label and drop its URL", () => {
      expect(markdownToReadableText("Voir [le site](https://refugies.info) pour la suite.")).toBe(
        "Voir le site pour la suite.",
      );
    });

    it("should keep an image alt text, which is its accessible description", () => {
      expect(markdownToReadableText("![Une carte de séjour](https://x.fr/carte.png)")).toBe(
        "Une carte de séjour",
      );
    });

    it("should keep the content of inline code without the backticks", () => {
      expect(markdownToReadableText("Tapez `oui` pour valider.")).toBe("Tapez oui pour valider.");
    });

    it("should drop autolinked URLs and email addresses", () => {
      expect(markdownToReadableText("Écrivez à <contact@refugies.info> aujourd'hui.")).toBe(
        "Écrivez à aujourd'hui.",
      );
    });

    it("should drop raw HTML tags but keep their text", () => {
      expect(markdownToReadableText("Un texte <strong>important</strong>.")).toBe(
        "Un texte important.",
      );
    });

    it("should unescape escaped markdown characters", () => {
      expect(markdownToReadableText("Un ast\\*risque et un underscore\\_.")).toBe(
        "Un ast*risque et un underscore_.",
      );
    });

    it("should collapse runs of whitespace", () => {
      expect(markdownToReadableText("Un    texte\tespacé.")).toBe("Un texte espacé.");
    });
  });

  describe("code blocks", () => {
    it("should drop a fenced code block entirely", () => {
      expect(markdownToReadableText("Avant.\n\n```js\nconst a = 1;\n```\n\nAprès.")).toBe(
        "Avant. Après.",
      );
    });

    it("should drop a tilde-fenced code block", () => {
      expect(markdownToReadableText("Avant.\n\n~~~\ncode\n~~~\n\nAprès.")).toBe("Avant. Après.");
    });

    it("should not treat markdown syntax inside a code block as content", () => {
      expect(markdownToReadableText("```\n# Pas un titre\n```\n\nAprès.")).toBe("Après.");
    });
  });

  describe("GFM tables", () => {
    it("should read the cells of a table and drop its alignment row", () => {
      const markdown = ["| Pays | Délai |", "| --- | --- |", "| France | 3 mois |"].join("\n");
      expect(markdownToReadableText(markdown)).toBe("Pays. Délai. France. 3 mois");
    });

    it("should drop an alignment row using colons", () => {
      const markdown = ["| A | B |", "|:---:|---:|", "| 1 | 2 |"].join("\n");
      expect(markdownToReadableText(markdown)).toBe("A. B. 1. 2");
    });
  });

  describe("directives", () => {
    it("should read the title of a toggle and its content", () => {
      const markdown = ':::toggle{title="Comment faire ?"}\nDemandez un rendez-vous.\n:::';
      expect(markdownToReadableText(markdown)).toBe("Comment faire ? Demandez un rendez-vous.");
    });

    it("should drop an important callout fence and keep its content", () => {
      const markdown = ":::important\nLe délai est de trois mois.\n:::";
      expect(markdownToReadableText(markdown)).toBe("Le délai est de trois mois.");
    });

    it("should drop a good-to-know callout fence and keep its content", () => {
      const markdown = ":::good-to-know\nUn conseil utile.\n:::";
      expect(markdownToReadableText(markdown)).toBe("Un conseil utile.");
    });

    it("should drop a toggle fence carrying no title", () => {
      expect(markdownToReadableText(":::toggle\nUn contenu.\n:::")).toBe("Un contenu.");
    });

    it("should strip the inline syntax of a toggle title", () => {
      const markdown = ':::toggle{title="Un titre **important**"}\nUn contenu.\n:::';
      expect(markdownToReadableText(markdown)).toBe("Un titre important. Un contenu.");
    });

    it("should handle nested directives", () => {
      const markdown = [
        ':::toggle{title="Étapes"}',
        ":::important",
        "Apportez vos papiers.",
        ":::",
        ":::",
      ].join("\n");
      expect(markdownToReadableText(markdown)).toBe("Étapes. Apportez vos papiers.");
    });

    it("should leave a time notation untouched", () => {
      expect(markdownToReadableText("Ouvert de 9:00 à 17:00.")).toBe("Ouvert de 9:00 à 17:00.");
    });

    it("should keep a fence carrying a name that is not a known directive", () => {
      expect(markdownToReadableText(":::danger\nUn contenu.\n:::")).toBe(":::danger. Un contenu.");
    });
  });

  describe("a realistic RCO document", () => {
    it("should produce a single readable string", () => {
      const markdown = [
        "# Demander l'allocation pour demandeur d'asile",
        "",
        "L'**ADA** est versée aux personnes en cours de demande d'asile.",
        "",
        ":::important",
        "Vous devez avoir accepté les conditions matérielles d'accueil.",
        ":::",
        "",
        "## Les étapes",
        "",
        "1. Se présenter au [guichet unique](https://refugies.info/guda)",
        "2. Fournir une attestation",
        "",
        ':::toggle{title="Et si je déménage ?"}',
        "Signalez votre nouvelle adresse sous 15 jours.",
        ":::",
      ].join("\n");

      expect(markdownToReadableText(markdown)).toBe(
        "Demander l'allocation pour demandeur d'asile. " +
          "L'ADA est versée aux personnes en cours de demande d'asile. " +
          "Vous devez avoir accepté les conditions matérielles d'accueil. " +
          "Les étapes. " +
          "Se présenter au guichet unique. " +
          "Fournir une attestation. " +
          "Et si je déménage ? " +
          "Signalez votre nouvelle adresse sous 15 jours.",
      );
    });
  });
});
