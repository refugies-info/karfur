import { DIRECTIVE_HTML_MAPPING, VALID_DIRECTIVE_NAMES } from "../constants";

describe("VALID_DIRECTIVE_NAMES", () => {
  it("should contain exactly 3 directives", () => {
    expect(VALID_DIRECTIVE_NAMES.size).toBe(3);
  });

  it("should recognize 'toggle' as valid", () => {
    expect(VALID_DIRECTIVE_NAMES.has("toggle")).toBe(true);
  });

  it("should recognize 'important' as valid", () => {
    expect(VALID_DIRECTIVE_NAMES.has("important")).toBe(true);
  });

  it("should recognize 'good-to-know' as valid", () => {
    expect(VALID_DIRECTIVE_NAMES.has("good-to-know")).toBe(true);
  });

  it("should reject '00' (from 9:00 time notation)", () => {
    expect(VALID_DIRECTIVE_NAMES.has("00")).toBe(false);
  });

  it("should reject unknown directive names", () => {
    expect(VALID_DIRECTIVE_NAMES.has("unknown")).toBe(false);
    expect(VALID_DIRECTIVE_NAMES.has("danger")).toBe(false);
    expect(VALID_DIRECTIVE_NAMES.has("warning")).toBe(false);
  });
});

describe("DIRECTIVE_HTML_MAPPING", () => {
  it("should have entries for all valid directive names", () => {
    for (const name of VALID_DIRECTIVE_NAMES) {
      expect(DIRECTIVE_HTML_MAPPING[name]).toBeDefined();
    }
  });

  it("should map toggle to div with data-toggle", () => {
    expect(DIRECTIVE_HTML_MAPPING.toggle).toEqual({
      hName: "div",
      hProperties: { "data-toggle": "true" },
    });
  });

  it("should map important to div with data-callout='important'", () => {
    expect(DIRECTIVE_HTML_MAPPING.important).toEqual({
      hName: "div",
      hProperties: { "data-callout": "important" },
    });
  });

  it("should map good-to-know to div with data-callout='info'", () => {
    expect(DIRECTIVE_HTML_MAPPING["good-to-know"]).toEqual({
      hName: "div",
      hProperties: { "data-callout": "info" },
    });
  });
});
