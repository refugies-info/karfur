import Button from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { GetTraductionsForReview, TranslatorFeedback } from "@refugies-info/api-types";
import Image from "next/image";
import { useState } from "react";
import marioProfile from "~/assets/mario-profile.jpg";
import EVAIcon from "~/components/UI/EVAIcon";
import { cls } from "~/lib/classname";
import styles from "./NotationInput.module.scss";

interface Props {
  author?: GetTraductionsForReview["author"];
  feedback: TranslatorFeedback;
  setFeedback: (data: TranslatorFeedback) => void;
}

const STARS = new Array(5).fill(true);

const NotationInput = (props: Props) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const avatar = props.author?.picture?.secure_url || marioProfile;

  return (
    <div className={styles.item}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <Image
            className={cls(styles.avatar, "me-2")}
            src={avatar}
            alt=""
            width={32}
            height={32}
            style={{ objectFit: "contain" }}
          />
          {props.author?.username || ""}
        </div>

        <div className="d-flex gap-2">
          {STARS.map((_, i) => {
            const checked = props.feedback.note && props.feedback.note >= i + 1;
            return (
              <button
                key={i}
                className="p-0"
                title={`Donner une note de ${i + 1}/5`}
                onClick={() => props.setFeedback({ ...props.feedback, note: i + 1 })}
              >
                <EVAIcon
                  name={checked ? "star" : "star-outline"}
                  size={24}
                  fill={checked ? "var(--border-action-low-yellow-tournesol)" : "var(--text-disabled-grey)"}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        {!showCommentInput ? (
          <Button priority="tertiary no outline" iconId="fr-icon-add-line" onClick={() => setShowCommentInput(true)}>
            Ajouter un commentaire
          </Button>
        ) : (
          <Input
            label=""
            textArea
            nativeTextAreaProps={{
              placeholder: "Ajoutez ici un commentaire (optionnel)",
              value: props.feedback.comment,
              onChange: (e: any) => props.setFeedback({ ...props.feedback, comment: e.target.value }),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default NotationInput;
