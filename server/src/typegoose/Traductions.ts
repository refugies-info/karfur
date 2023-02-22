import { isDocument, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { isEmpty, isString } from "lodash";
import { MustBePopulatedError } from "../errors";
import { Base } from "./Base";
import {
  DemarcheContent,
  Dispositif,
  DispositifContent,
  InfoSection,
  InfoSections,
  TranslationContent,
} from "./Dispositif";
import { Languages } from "./generics";
import { User } from "./User";

export type TraductionsType = "suggestion" | "validation";
export enum TraductionsStatus {
  VALIDATED = "VALIDATED",
  TO_REVIEW = "TO_REVIEW",
  PENDING = "PENDING",
  TO_TRANSLATE = "TO_TRANSLATE",
}

/**
 * Basic word counter
 *
 * TODO améliorer le compteur lorsque l'on passera en markdown pour retirer les marqueurs markdown
 * @todo
 * @param str string
 * @returns number of words
 */
const countWords = (str?: string): number => (isString(str) ? str.split(/\s+/).length : 0);

const countWordsForRecord = (records: Record<any, string>): number =>
  Object.values(records || {}).reduce((acc, cur) => acc + countWords(cur), 0);

const countWordsForInfoSections = (infoSections: InfoSections): number =>
  Object.values(infoSections || {}).reduce(
    (acc, { title, text }: InfoSection) => acc + countWords(title) + countWords(text),
    0,
  );

@modelOptions({ schemaOptions: { collection: "traductions", timestamps: { createdAt: "created_at" } } })
export class Traductions extends Base {
  @prop({ ref: () => Dispositif })
  public dispositifId: Ref<Dispositif>;

  @prop({ ref: () => User })
  public userId: Ref<User>;

  @prop({ required: true })
  public language!: Languages;

  @prop({ required: true })
  public translated!: Partial<TranslationContent>;

  @prop({ ref: () => User })
  public validatorId: Ref<User>;

  @prop()
  public timeSpent: number;

  @prop()
  public avancement: number;

  @prop({ type: () => [String] })
  public toReview?: string[];

  @prop()
  public type: TraductionsType;

  @prop()
  public created_at: Date;

  @prop()
  public updatedAt: Date;

  public countWords(): number {
    return (
      countWords(this.translated.content?.titreInformatif) +
      countWords(this.translated.content?.titreMarque) +
      countWords(this.translated.content?.abstract) +
      countWords(this.translated.content?.what) +
      countWordsForInfoSections(this.translated.content?.how) +
      (this.translated.content instanceof DemarcheContent
        ? countWordsForInfoSections(this.translated.content?.next)
        : 0) +
      (this.translated.content instanceof DispositifContent
        ? countWordsForInfoSections(this.translated.content?.why)
        : 0) +
      countWordsForRecord(this.translated.metadatas)
    );
  }

  /**
   * Propriété virtuelle qui permet d'accéder au statut
   * avec la notation : `traduction.status`
   */
  public get status(): TraductionsStatus {
    if (this.type === "validation") {
      return isEmpty(this.toReview) && this.avancement >= 1 ? TraductionsStatus.VALIDATED : TraductionsStatus.TO_REVIEW;
    }

    // if type === "suggestion"
    return this.avancement >= 1 ? TraductionsStatus.PENDING : TraductionsStatus.TO_TRANSLATE;
  }

  public getUser(): User {
    if (!isDocument(this.userId)) {
      throw new MustBePopulatedError("userId");
    }
    return this.userId;
  }

  public static computeAvancement(dispositif: Dispositif, translation: Traductions): number {
    const dispositifSectionsCounter =
      Object.keys(dispositif.translations.fr.content).length +
      Object.keys(dispositif.translations.fr.metadatas || {}).length;
    const tranlationSectionsCounter =
      Object.keys(translation.translated?.content || {}).length +
      Object.keys(translation.translated?.metadatas || {}).length;
    return tranlationSectionsCounter / dispositifSectionsCounter;
  }
}

export type TraductionId = Traductions["_id"] | Traductions["id"];
