import {
  ageType,
  commitmentDetailsType,
  conditionType,
  ContentType,
  DispositifStatus,
  frenchLevelType,
  frequencyDetailsType,
  frequencyUnitType,
  Languages,
  locationType,
  priceDetails,
  publicStatusType,
  publicType,
  timeSlotType,
  timeUnitType,
} from "@refugies-info/api-types";
import { isDocument, isDocumentArray, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { get, has } from "lodash";
import { Types } from "mongoose";
import { MustBePopulatedError } from "~/errors";
import { PartialRecord } from "~/types/interface";
import { Base } from "./Base";
import { ImageSchema, RichText, Uuid } from "./generics";
import { Need, NeedId } from "./Need";

import { Structure, StructureId } from "./Structure";
import { Theme, ThemeId } from "./Theme";
import { User } from "./User";

export class Sponsor {
  @prop()
  name: String;
  @prop()
  logo?: String;
  @prop()
  link?: String;
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
  @prop()
  administrationName: string | null;
}

export class Suggestion {
  @prop()
  created_at: Date;
  @prop()
  userId?: Types.ObjectId;
  @prop()
  read: boolean;
  @prop()
  suggestion: string;
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
  public created_at!: Date;

  @prop()
  validatorId!: Types.ObjectId;
}

export class Age {
  @prop({ type: String })
  public type!: ageType;
  @prop()
  public ages: number[];
}

export class Price {
  @prop()
  public values: number[]; // 0 = free, empty = montant libre
  @prop()
  public details?: priceDetails;
}

export class Commitment {
  @prop()
  public amountDetails: commitmentDetailsType;
  @prop()
  public hours: number[];
  @prop()
  public timeUnit: timeUnitType;
}

export class Frequency {
  @prop()
  public amountDetails: frequencyDetailsType;
  @prop()
  public hours: number;
  @prop()
  public timeUnit: timeUnitType;
  @prop()
  public frequencyUnit: frequencyUnitType;
}

export class Metadatas {
  @prop()
  public location?: locationType | null;
  @prop()
  public frenchLevel?: frenchLevelType[] | null;
  @prop({ _id: false })
  public age?: Age | null;
  @prop({ _id: false })
  public price?: Price | null;
  @prop()
  public publicStatus?: publicStatusType[] | null;
  @prop()
  public public?: publicType[] | null;
  @prop()
  public conditions?: conditionType[] | null;
  @prop({ _id: false })
  public commitment?: Commitment | null;
  @prop({ _id: false })
  public frequency?: Frequency | null;
  @prop()
  public timeSlots?: timeSlotType[] | null;
}

export class Poi {
  @prop()
  public title!: string;
  @prop()
  public address!: string;
  @prop()
  public city?: string | null;
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
  @prop()
  public sponsors?: (Ref<Structure> | Sponsor)[];
  @prop()
  public externalLink?: string;

  @prop({ required: true, ref: () => User })
  public creatorId!: Ref<User>;
  @prop({ ref: () => User })
  public participants: Ref<User>[];

  @prop()
  public lastAdminUpdate?: Date;
  @prop({ ref: () => User })
  public lastModificationAuthor: Ref<User>;
  @prop()
  public lastModificationDate?: Date;
  @prop()
  public publishedAt?: Date;
  @prop({ ref: () => User })
  public publishedAtAuthor?: Ref<User>;
  @prop()
  public deletionDate?: Date;

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
  public hasDraftVersion?: boolean; // TODO: use aggregation to get that value?

  @prop()
  public draftReminderMailSentDate?: Date;
  @prop()
  public draftSecondReminderMailSentDate?: Date;
  @prop()
  public lastReminderMailSentToUpdateContentDate?: Date;

  @prop()
  public themesSelectedByAuthor: boolean;
  @prop()
  public notificationsSent: PartialRecord<Languages, boolean>;

  @prop()
  public suggestions: Suggestion[];
  @prop()
  public merci: Merci[];
  @prop()
  public webOnly: boolean;

  @prop()
  public translations!: PartialRecord<Languages, TranslationContent>;
  @prop({ _id: false })
  public metadatas: Metadatas;
  @prop()
  public map: Poi[] | null;
  @prop({ type: () => ImageSchema, _id: false })
  public administrationLogo?: ImageSchema | null;

  public getMainSponsor(): Structure {
    if (!this.mainSponsor || !isDocument(this.mainSponsor)) {
      throw new MustBePopulatedError("mainSponsor");
    }

    return this.mainSponsor;
  }

  public getDepartements() {
    return this.metadatas.location || null;
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

  public getNeeds(): Need[] {
    if (!this.needs) return [];
    if (!isDocumentArray(this.needs)) {
      throw new MustBePopulatedError("needs");
    }
    return this.needs;
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
