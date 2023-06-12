import { isDocument, modelOptions, prop, Ref } from "@typegoose/typegoose";
import { Languages } from "@refugies-info/api-types";
import { difference, flattenDeep, get, intersection, isEmpty } from "lodash";
import { MustBePopulatedError } from "../errors";
import { Base } from "./Base";
import {
  Dispositif,
  TranslationContent,
} from "./Dispositif";
import { User } from "./User";
import { countDispositifWords } from "../libs/wordCounter";

export enum TraductionsType {
  SUGGESTION = "suggestion",
  VALIDATION = "validation",
}
export enum TraductionsStatus {
  VALIDATED = "VALIDATED",
  TO_REVIEW = "TO_REVIEW",
  PENDING = "PENDING",
  TO_TRANSLATE = "TO_TRANSLATE",
}

export interface TraductionDiff {
  added: string[];
  modified: string[];
  removed: string[];
}

const keysForSubSection = (prefix: string, translated: any) =>
  flattenDeep(
    Object.keys(get(translated, prefix, {})).map((key) => {
      const arr = [];
      if (!isEmpty(get(translated, `${prefix}.${key}.title`, ""))) {
        arr.push(`${prefix}.${key}.title`);
      }
      if (!isEmpty(get(translated, `${prefix}.${key}.text`, ""))) {
        arr.push(`${prefix}.${key}.text`);
      }
      return arr;
    }),
  );

/**
 * Cette fonction permet de récupérer l'ensemble des sections
 * du langue du dispositif ou d'une traduction.
 * @param translated
 * @returns
 */
const keys = (translated: any) => {
  return [
    ...Object.keys(translated?.content || {})
      .filter((key) => !["how", "why", "next"].includes(key))
      .map((key) => `content.${key}`),
    ...keysForSubSection("content.why", translated),
    ...keysForSubSection("content.how", translated),
    ...keysForSubSection("content.next", translated),
    ...Object.keys(translated?.metadatas || {}).map((key) => `metadatas.${key}`),
  ];
};

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

  @prop()
  public timeSpent: number;

  @prop()
  public avancement: number;

  @prop({ type: () => [String] })
  public toReview?: string[];

  @prop({ type: () => [String] })
  public toFinish?: string[];

  @prop()
  public type: TraductionsType;

  @prop()
  public created_at: Date;

  @prop()
  public updatedAt: Date;

  public countWords(): number {
    return countDispositifWords(this.translated.content)
  }

  /**
   * Propriété virtuelle qui permet d'accéder au statut
   * avec la notation : `traduction.status`
   */
  public get status(): TraductionsStatus {
    if (this.type === TraductionsType.VALIDATION) {
      return isEmpty(this.toReview) && this.avancement === 1
        ? TraductionsStatus.VALIDATED
        : TraductionsStatus.TO_REVIEW;
    }

    // if type === "suggestion"
    return this.avancement === 1 ? TraductionsStatus.PENDING : TraductionsStatus.TO_TRANSLATE;
  }

  public getUser(): User {
    if (!isDocument(this.userId)) {
      throw new MustBePopulatedError("userId");
    }
    return this.userId;
  }

  public static diff(origin: TranslationContent, compareTo: TranslationContent): TraductionDiff {
    const originKeys = keys(origin);
    const compareToKeys = keys(compareTo);
    // ces champs devront être traduits impérativement => to review
    const added = difference(compareToKeys, originKeys);
    // les champs supprimés peuvent être traités automatiquement sans re-traduction
    const removed = difference(originKeys, compareToKeys);

    // et la c'est le flou
    const intersec = intersection(originKeys, compareToKeys);
    const modified = intersec.filter((section) => get(origin, section) !== get(compareTo, section));

    return { added, modified, removed };
  }

  public static computeAvancement(dispositif: Dispositif, translation: Traductions): number {
    const dispositifSectionsCounter = keys(dispositif.translations.fr).length;
    const translationSectionsCounter = keys(translation.translated).length;
    const notFinished = [...new Set([...(translation.toFinish || []), ...(translation.toReview || [])])].length;
    return (translationSectionsCounter - notFinished) / dispositifSectionsCounter;
  }
}

export type TraductionId = Traductions["_id"] | Traductions["id"];
