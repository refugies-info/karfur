import { useEffect } from "react";
import { useAsyncFn, useList } from "react-use";
import { useSelector } from "react-redux";
import { GetTraductionsForReview, Languages, TranslatorFeedback } from "@refugies-info/api-types";
import API from "utils/API";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import NotationInput from "./NotationInput";

interface Props {
  locale?: Languages;
  translators: GetTraductionsForReview["author"][];
  onDone: () => void;
}

const NotationForm = ({ locale, translators, onDone }: Props) => {
  const dispositif = useSelector(selectedDispositifSelector);
  const [feedbacks, { set, updateAt }] = useList<TranslatorFeedback>([]);

  useEffect(() => {
    set(
      translators.map((t) => ({
        comment: "",
        note: 0,
        translatorId: t.id,
      })),
    );
  }, [translators, set]);

  const [{ loading }, submit] = useAsyncFn(async () => {
    if (!dispositif?._id || !locale) return;

    const filledFeedbacks = feedbacks.filter((f) => f.note > 0 || f.comment !== "");
    if (filledFeedbacks.length > 0) {
      await API.sendFeedback({
        contentId: dispositif._id.toString(),
        language: locale,
        feedbacks,
      });
    }
    onDone();
  }, [feedbacks, dispositif, locale, onDone]);

  return (
    <>
      {feedbacks.map((f, i) => (
        <NotationInput
          key={i}
          author={translators.find((t) => t.id === f.translatorId)}
          feedback={f}
          setFeedback={(data) => {
            updateAt(i, data);
          }}
        />
      ))}
      <div className="text-end mt-2">
        <Button evaIcon="checkmark-circle-2" iconPosition="right" onClick={submit} disabled={loading}>
          Valider
        </Button>
      </div>
    </>
  );
};

export default NotationForm;
