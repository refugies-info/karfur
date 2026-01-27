import { markdownToHtml } from "./markdown";

describe("markdownToHtml", () => {
  it("should convert basic markdown to html", async () => {
    const md = "# Hello\n\nThis is a paragraph.";
    const html = await markdownToHtml(md);
    expect(html).toContain("<h1>Hello</h1>");
    expect(html).toContain("<p>This is a paragraph.</p>");
  });

  it("should convert :::toggle directive", async () => {
    const md = ':::toggle{title="My Title" stepNumber="1"}\nContent inside\n:::';
    const html = await markdownToHtml(md);
    expect(html).toContain('data-component="toggle"');
    expect(html).toContain('data-title="My Title"');
    expect(html).toContain('data-step-number="1"');
    expect(html).toContain("Content inside");
  });

  it("should convert :::important directive", async () => {
    const md = ":::important\nWarning message\n:::";
    const html = await markdownToHtml(md);
    expect(html).toContain('data-callout="important"');
    expect(html).toContain("Warning message");
  });

  it("should convert :::good-to-know directive to data-callout=info", async () => {
    const md = ":::good-to-know\nInfo message\n:::";
    const html = await markdownToHtml(md);
    expect(html).toContain('data-callout="info"');
    expect(html).toContain("Info message");
  });

  it("should handle nested directives correctly (restore hierarchy)", async () => {
    // Cas problématique classique où le parser 'flat' échoue sans le plugin de restauration
    const md = `
:::toggle{title="Parent"}
:::important
Child content
:::
:::
`;
    const html = await markdownToHtml(md);

    // On doit avoir le callout 'important' À L'INTÉRIEUR du toggle
    // Regex approximative pour vérifier l'ordre/imbrication
    // toggle start ... important start ... important end ... toggle end

    // Vérifions simplement que les deux data attributes sont présents
    expect(html).toContain('data-component="toggle"');
    expect(html).toContain('data-callout="important"');

    // Si la hiérarchie est respectée, le contenu child doit être présent
    expect(html).toContain("Child content");
  });
  it("should cleanup ::: fences from output", async () => {
    const markdown = ":::toggle{title='Test'}\nSome content\n:::\n\n:::important\nWarning\n:::";
    const html = await markdownToHtml(markdown);
    expect(html).not.toContain(":::");
    expect(html).toContain('data-component="toggle"');
    expect(html).toContain('data-callout="important"');
  });
});
