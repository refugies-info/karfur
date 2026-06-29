import { InvalidRequestError } from "~/errors";
import { normalizeAgirOperators } from "./normalizeAgirOperators";

describe("normalizeAgirOperators", () => {
  it("normalizes valid Grist records and keeps non-critical trim warnings", () => {
    const result = normalizeAgirOperators([
      {
        id: 1,
        fields: {
          Departement: "01 - Ain",
          Operateur: " Alfa3a ",
          Mail_generique: " agir01@alfa3a.org\n",
          Telephone: " 07 48 13 40 00 ",
          Fiche_RI: "https://refugies.info/fr/dispositif/660d1f34de63124662360640",
        },
      },
    ]);

    expect(result.operatorsPerDepartment).toEqual({
      "01": {
        department: "01 - Ain",
        dispositifId: "660d1f34de63124662360640",
        email: "agir01@alfa3a.org",
        operator: "Alfa3a",
        phone: "07 48 13 40 00",
      },
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "trimmed_value", field: "Operateur", recordId: 1 }),
        expect.objectContaining({ code: "trimmed_value", field: "Mail_generique", recordId: 1 }),
        expect.objectContaining({ code: "trimmed_value", field: "Telephone", recordId: 1 }),
      ]),
    );
  });

  it("drops invalid optional fields and returns warnings", () => {
    const result = normalizeAgirOperators([
      {
        id: 2,
        fields: {
          Departement: "02 - Aisne",
          Operateur: "SOS Solidarités",
          Mail_generique: "email-invalide",
          Fiche_RI: "https://refugies.info/fr/dispositif/pas-un-id",
        },
      },
    ]);

    expect(result.operatorsPerDepartment["02"]).toEqual({
      department: "02 - Aisne",
      operator: "SOS Solidarités",
    });
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ code: "invalid_email", field: "Mail_generique", recordId: 2 }),
        expect.objectContaining({
          code: "invalid_dispositif_link",
          field: "Fiche_RI",
          recordId: 2,
        }),
      ]),
    );
  });

  it("rejects duplicate departments", () => {
    expect(() =>
      normalizeAgirOperators([
        { id: 1, fields: { Departement: "01 - Ain", Operateur: "Alfa3a" } },
        { id: 2, fields: { Departement: "01 - Ain", Operateur: "Autre opérateur" } },
      ]),
    ).toThrow(InvalidRequestError);
  });

  it("rejects records without operator", () => {
    expect(() =>
      normalizeAgirOperators([{ id: 1, fields: { Departement: "01 - Ain", Operateur: "   " } }]),
    ).toThrow(InvalidRequestError);
  });
});
