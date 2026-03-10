import {
  getDirectivePrefix,
  isClosingFenceParagraph,
  isValidDirectiveName,
  reconstructDirectiveText,
} from "../helpers";

describe("isValidDirectiveName", () => {
  it("should accept 'toggle'", () => {
    expect(isValidDirectiveName("toggle")).toBe(true);
  });

  it("should accept 'important'", () => {
    expect(isValidDirectiveName("important")).toBe(true);
  });

  it("should accept 'good-to-know'", () => {
    expect(isValidDirectiveName("good-to-know")).toBe(true);
  });

  it("should reject names starting with a number", () => {
    expect(isValidDirectiveName("00")).toBe(false);
    expect(isValidDirectiveName("1foo")).toBe(false);
  });

  it("should reject names not in the whitelist", () => {
    expect(isValidDirectiveName("unknown")).toBe(false);
    expect(isValidDirectiveName("danger")).toBe(false);
    expect(isValidDirectiveName("warning")).toBe(false);
  });

  it("should reject empty string", () => {
    expect(isValidDirectiveName("")).toBe(false);
  });
});

describe("getDirectivePrefix", () => {
  it("should return ':' for textDirective", () => {
    expect(getDirectivePrefix("textDirective")).toBe(":");
  });

  it("should return '::' for leafDirective", () => {
    expect(getDirectivePrefix("leafDirective")).toBe("::");
  });

  it("should return ':::' for containerDirective", () => {
    expect(getDirectivePrefix("containerDirective")).toBe(":::");
  });

  it("should return ':::' for unknown types (fallback)", () => {
    expect(getDirectivePrefix("unknown")).toBe(":::");
  });
});

describe("reconstructDirectiveText", () => {
  it("should reconstruct text directive", () => {
    const node = { type: "textDirective", name: "00", attributes: {} };
    expect(reconstructDirectiveText(node)).toBe(":00");
  });

  it("should reconstruct leaf directive", () => {
    const node = { type: "leafDirective", name: "foo", attributes: {} };
    expect(reconstructDirectiveText(node)).toBe("::foo");
  });

  it("should reconstruct container directive", () => {
    const node = { type: "containerDirective", name: "bar", attributes: {} };
    expect(reconstructDirectiveText(node)).toBe(":::bar");
  });

  it("should include attributes", () => {
    const node = {
      type: "containerDirective",
      name: "toggle",
      attributes: { title: "My Title" },
    };
    expect(reconstructDirectiveText(node)).toBe(':::toggle{title="My Title"}');
  });

  it("should handle multiple attributes", () => {
    const node = {
      type: "containerDirective",
      name: "toggle",
      attributes: { title: "Title", stepNumber: "1" },
    };
    const result = reconstructDirectiveText(node);
    expect(result).toContain(":::toggle{");
    expect(result).toContain('title="Title"');
    expect(result).toContain('stepNumber="1"');
  });

  it("should handle no attributes", () => {
    const node = { type: "containerDirective", name: "important" };
    expect(reconstructDirectiveText(node)).toBe(":::important");
  });
});

describe("isClosingFenceParagraph", () => {
  it("should detect paragraph with only ':::'", () => {
    const node = {
      type: "paragraph",
      children: [{ type: "text", value: ":::" }],
    };
    expect(isClosingFenceParagraph(node)).toBe(true);
  });

  it("should detect paragraph with ':::' and whitespace", () => {
    const node = {
      type: "paragraph",
      children: [{ type: "text", value: "  :::  " }],
    };
    expect(isClosingFenceParagraph(node)).toBe(true);
  });

  it("should reject paragraph with other text", () => {
    const node = {
      type: "paragraph",
      children: [{ type: "text", value: "Hello" }],
    };
    expect(isClosingFenceParagraph(node)).toBe(false);
  });

  it("should reject paragraph with ':::' and extra content", () => {
    const node = {
      type: "paragraph",
      children: [{ type: "text", value: "::: extra" }],
    };
    expect(isClosingFenceParagraph(node)).toBe(false);
  });

  it("should reject paragraph with multiple children", () => {
    const node = {
      type: "paragraph",
      children: [
        { type: "text", value: ":::" },
        { type: "text", value: "extra" },
      ],
    };
    expect(isClosingFenceParagraph(node)).toBe(false);
  });

  it("should reject non-paragraph nodes", () => {
    const node = { type: "text", value: ":::" };
    expect(isClosingFenceParagraph(node)).toBe(false);
  });

  it("should reject nodes without children", () => {
    const node = { type: "paragraph" };
    expect(isClosingFenceParagraph(node)).toBe(false);
  });
});
