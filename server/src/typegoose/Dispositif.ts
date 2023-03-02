import { isDocument, isDocumentArray, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { ContentType, DispositifStatus, Languages } from "api-types";
import { get, has } from "lodash";
import { Types } from "mongoose";
import { MustBePopulatedError } from "../errors";
import { Base } from "./Base";
import { RichText, Uuid } from "./generics";
import { Need, NeedId } from "./Need";

import { Structure, StructureId } from "./Structure";
import { Theme, ThemeId } from "./Theme";
import { User, UserId } from "./User";

type frenchLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type ageType = "lessThan" | "moreThan" | "between";
type priceDetails = "une fois" | "à chaque fois" | "par heure" | "par semaine" | "par mois" | "par an";
type publicType = "refugee" | "all";
type justificatifType = "diplome" | "titre sejour" | "domicile";

export class Sponsor {
  @prop()
  name: String;
  @prop()
  logo: String;
  @prop()
  link: String;
}

export class Content {
  @prop()
  titreInformatif: string;
  @prop()
  titreMarque: string;
  @prop()
  abstract: string;
}

export class InfoSection {
  @prop()
  title: string;
  @prop()
  text: RichText;
}
export type InfoSections = { [key: Uuid]: InfoSection };
// export type InfoSections = Record<Uuid, InfoSection>;

export class DispositifContent extends Content {
  @prop()
  what: RichText;
  @prop()
  why: { [key: string]: InfoSection };
  @prop()
  how: InfoSections;
}
export class DemarcheContent extends Content {
  @prop()
  what: RichText;
  @prop()
  how: InfoSections;
  @prop()
  next: InfoSections;
}

export class Suggestion {
  @prop()
  created_at: Date;
  @prop()
  userId?: Types.ObjectId;
  @prop()
  read: Boolean;
  @prop()
  suggestion: String;
  @prop()
  suggestionId: Uuid;
  @prop()
  section: keyof DispositifContent | keyof DemarcheContent;
}

export class Merci {
  @prop()
  created_at: Date;
  @prop()
  userId?: Types.ObjectId;
}

export class TranslationContent {
  @prop()
  public content!: DispositifContent | DemarcheContent;

  @prop()
  public metadatas!: {
    important?: string;
    duration?: string;
  };
}

export class Age {
  @prop({ type: String })
  public type!: ageType;
  @prop()
  public ages: number[];
}

export class Price {
  @prop()
  public value: number;
  @prop()
  public details?: priceDetails;
}

export class Metadatas {
  @prop()
  public location?: string[];
  @prop()
  public frenchLevel?: frenchLevel[];
  @prop()
  public important?: string;
  @prop({ _id: false })
  public age?: Age;
  @prop({ _id: false })
  public price?: Price;
  @prop()
  public duration?: string;
  @prop()
  public public?: publicType;
  @prop()
  public titreSejourRequired?: boolean;
  @prop()
  public acteNaissanceRequired?: boolean;
  @prop()
  public justificatif?: justificatifType;
}

export class Poi {
  @prop()
  public title!: string;
  @prop()
  public address!: string;
  @prop()
  public city!: string;
  @prop()
  public lat!: number;
  @prop()
  public lng!: number;
  @prop()
  public description?: string;
  @prop()
  public email?: string;
  @prop()
  public phone?: string;
}

// COLLECTION
@modelOptions({
  schemaOptions: {
    collection: "dispositifs",
    timestamps: { createdAt: "created_at" },
    toJSON: { getters: true, virtuals: true },
    toObject: { virtuals: true },
  },
})
export class Dispositif extends Base {
  @prop({ required: true, enum: ContentType })
  public typeContenu: ContentType;
  @prop({ required: true, enum: DispositifStatus })
  public status: DispositifStatus;
  @prop()
  created_at?: Date;
  @prop()
  updatedAt?: Date;

  @prop({ ref: () => Structure })
  public mainSponsor?: Ref<Structure, StructureId>;
  @prop({ ref: () => Theme })
  public theme?: Ref<Theme, ThemeId>;
  @prop({ ref: () => Theme })
  public secondaryThemes?: Ref<Theme, ThemeId>[];
  @prop({ ref: () => Need })
  public needs: Ref<Need, NeedId>[];
  @prop({ type: () => Sponsor, ref: () => Structure })
  public sponsors?: (Ref<Structure> | Sponsor)[];

  @prop({ required: true, ref: () => User })
  public creatorId!: Ref<User>;
  @prop({ ref: () => User })
  public participants: Ref<User>[];

  @prop()
  public lastAdminUpdate?: Date;
  @prop()
  public lastModificationAuthor: UserId;
  @prop()
  public lastModificationDate?: Date;
  @prop()
  public publishedAt?: Date;
  @prop()
  public publishedAtAuthor?: UserId;

  @prop({ default: 0 })
  public nbFavoritesMobile!: number;
  @prop({ default: 0 })
  public nbVues!: number;
  @prop({ default: 0 })
  public nbVuesMobile!: number;
  @prop({ default: 0 })
  public nbMots!: number;

  @prop()
  public adminComments?: string;
  @prop()
  public adminPercentageProgressionStatus?: string;
  @prop()
  public adminProgressionStatus?: string;

  @prop()
  public draftReminderMailSentDate?: Date;
  @prop()
  public draftSecondReminderMailSentDate?: Date;
  @prop()
  public lastReminderMailSentToUpdateContentDate?: Date;

  @prop()
  public themesSelectedByAuthor: boolean;
  @prop()
  public notificationsSent: Record<Languages, boolean>;

  @prop()
  public suggestions: Suggestion[];
  @prop()
  public merci: Merci[];
  @prop()
  public webOnly: boolean;

  @prop()
  public translations!: Record<Languages, TranslationContent>;
  @prop({ _id: false })
  public metadatas: Metadatas;
  @prop()
  public map: Poi[];

  public getMainSponsor(): Structure {
    if (!this.mainSponsor || !isDocument(this.mainSponsor)) {
      throw new MustBePopulatedError("mainSponsor");
    }

    return this.mainSponsor;
  }

  public getDepartements() {
    return this.metadatas.location || [];
  }

  public getTheme(): Theme | null {
    if (!this.theme) return null;
    if (!isDocument(this.theme)) {
      throw new MustBePopulatedError("theme");
    }
    return this.theme;
  }

  public getSecondaryThemes(): Theme[] {
    if (!this.secondaryThemes) return [];
    if (!isDocumentArray(this.secondaryThemes)) {
      throw new MustBePopulatedError("secondaryThemes");
    }
    return this.secondaryThemes;
  }

  public getCreator(): User | null {
    if (!this.creatorId) return null;
    if (!isDocument(this.creatorId)) {
      throw new MustBePopulatedError("creatorId");
    }
    return this.creatorId;
  }

  public isDispositif(): boolean {
    return this.typeContenu === ContentType.DISPOSITIF;
  }

  public isDemarche(): boolean {
    return this.typeContenu === ContentType.DEMARCHE;
  }

  public isTranslatedIn(ln: Languages) {
    return has(this.translations, ln);
  }

  /**
   * Cette fonction permet de récupérer un élément traduit depuis TranslationContent
   * dans la langue que vous voulez. Le path permet de cibler l'élément.
   *
   * @param path le chemin dans l'objet TranslationContent que vous voulez récupérer
   * @param ln la langue dans laquelle vous souhaitez récupérer la traduction
   * @param defaultLanguage le language dans lequel renvoyer la traduction si ln n'existe pas
   * @returns élément traduit
   *
   * @see TranslationContent
   */
  public getTranslated(path: string, ln: Languages | string = "fr", defaultLanguage: string = "fr"): any {
    return this.isTranslatedIn(ln as Languages)
      ? get(this.translations, `${ln}.${path}`)
      : get(this.translations, `${defaultLanguage}.${path}`);
  }

  public toJSON() {
    return JSON.stringify(this);
  }
}

export type DispositifId = Dispositif["_id"] | Dispositif["id"];
