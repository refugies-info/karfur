import { titlesToH4 } from "./contentParsing";

describe("titlesToH4", () => {
  it("turns the titles of the editor saved as h3 into h4, keeping their attributes and content", () => {
    expect(
      titlesToH4('<h3 class="rtri-title" dir="ltr">Un <strong>titre</strong></h3><p>Texte</p>'),
    ).toBe('<h4 class="rtri-title" dir="ltr">Un <strong>titre</strong></h4><p>Texte</p>');
  });

  it("converts every title of the content", () => {
    expect(titlesToH4('<h3 class="rtri-title">A</h3><p>x</p><h3 class="rtri-title">B</h3>')).toBe(
      '<h4 class="rtri-title">A</h4><p>x</p><h4 class="rtri-title">B</h4>',
    );
  });

  it("leaves the other headings alone", () => {
    const html =
      '<h3 class="fr-accordion__title">Accordéon</h3><h3>Sans classe</h3><h2 class="rtri-title">H2</h2>';
    expect(titlesToH4(html)).toBe(html);
  });
});
