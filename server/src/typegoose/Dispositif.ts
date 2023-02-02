import { modelOptions, prop, Ref } from "@typegoose/typegoose";
import { ObjectId } from "mongoose";
import { lnCode, RichText, Uuid } from "./generics";
import { Need } from "./Need";

import { Structure } from "./Structure";
import { Theme } from "./Theme";
import { User } from "./User";

type frenchLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type ageType = "lessThan" | "moreThan" | "between";
type priceDetails = "une fois" | "à chaque fois" | "par heure" | "par semaine" | "par mois" | "par an";
type publicType = "refugee" | "all";
type justificatifType = "diplome" | "titre sejour" | "domicile";
type contentType = "dispositif" | "demarche";

class Sponsor {
  @prop()
  name: String;
  @prop()
  logo: String;
  @prop()
  link: String;
}

class Content {
  @prop()
  titreInformatif: String;
  @prop()
  titreMarque: String;
  @prop()
  abstract: String;
}

class InfoSection {
  @prop()
  title: String;
  @prop()
  text: RichText;
}
type InfoSections = Record<Uuid, InfoSection>;

class DispositifContent extends Content {
  @prop()
  what: RichText;
  @prop()
  why: InfoSections;
  @prop()
  how: InfoSections;
}
class DemarcheContent extends Content {
  @prop()
  what: RichText;
  @prop()
  how: InfoSections;
  @prop()
  next: InfoSections;
}

class Suggestion {
  @prop()
  created_at: Date;
  @prop()
  userId?: ObjectId;
  @prop()
  read: Boolean;
  @prop()
  suggestion: String;
  @prop()
  suggestionId: Uuid;
  @prop()
  section: keyof DispositifContent | keyof DemarcheContent;
}

class Merci {
  @prop()
  created_at: Date;
  @prop()
  userId?: ObjectId;
}

class TranslationContent {
  @prop()
  public content!: DispositifContent | DemarcheContent;

  @prop()
  public metadata!: {
    important?: string;
    duration?: string;
  };
}

class Age {
  @prop({ type: String })
  public type!: ageType;
  @prop()
  public ages: Number[];
}

class Price {
  @prop()
  public value: Number;
  @prop()
  public details?: priceDetails;
}

class Metadatas {
  @prop()
  public location?: string[];
  @prop()
  public frenchLevel?: frenchLevel[];
  @prop()
  public important?: string;
  @prop()
  public age?: Age;
  @prop()
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

class Poi {
  @prop()
  public title!: String;
  @prop()
  public address!: String;
  @prop()
  public city!: String;
  @prop()
  public lat!: Number;
  @prop()
  public lng!: Number;
  @prop()
  public description?: String;
  @prop()
  public email?: String;
  @prop()
  public phone?: String;
}

// COLLECTION
@modelOptions({
  //   schemaOptions: {
  //     toJSON: { virtuals: true },
  //     toObject: { virtuals: true }
  //   }
  schemaOptions: { timestamps: { createdAt: "created_at" } }
})
export class Dispositif {
  @prop({ required: true })
  public type: contentType;
  @prop({ required: true })
  public status: "actif" | "brouillon"; // TODO: clean type

  @prop({ ref: () => Structure })
  public mainSponsor?: Ref<Structure>;
  @prop({ ref: () => Theme })
  public theme?: Ref<Theme>;
  @prop({ ref: () => Theme })
  public secondaryThemes?: Ref<Theme>[];
  @prop({ ref: () => Need })
  public needs: Ref<Need>[];
  @prop({ type: () => Sponsor, ref: () => Structure })
  public sponsors?: (Ref<Structure> | Sponsor)[];

  @prop({ required: true, ref: () => User })
  public creatorId!: Ref<User>;
  @prop({ ref: () => User })
  public participants: Ref<User>[];

  @prop()
  public lastAdminUpdate?: Date;
  @prop()
  public lastModificationAuthor: ObjectId;
  @prop()
  public lastModificationDate?: Date;
  @prop()
  public publishedAt?: Date;
  @prop()
  public publishedAtAuthor?: ObjectId;

  @prop({ default: 0 })
  public nbFavoritesMobile!: number;
  @prop({ default: 0 })
  public nbVues!: number;
  @prop({ default: 0 })
  public nbVuesMobile!: number;
  @prop({ default: 0 })
  public nbMots!: number;

  @prop()
  public adminComments?: String;
  @prop()
  public adminPercentageProgressionStatus?: String;
  @prop()
  public adminProgressionStatus?: String;

  @prop()
  public draftReminderMailSentDate?: Date;
  @prop()
  public draftSecondReminderMailSentDate?: Date;
  @prop()
  public lastReminderMailSentToUpdateContentDate?: Date;

  @prop()
  public themesSelectedByAuthor: boolean;
  @prop()
  public notificationsSent: Record<lnCode, boolean>;

  @prop()
  public suggestions: Suggestion[];
  @prop()
  public merci: Merci[];
  @prop()
  public webOnly: Boolean;

  @prop()
  public translations!: Record<lnCode, TranslationContent>;
  @prop()
  public metadatas: Metadatas;
  @prop()
  public map: Poi[];
}
