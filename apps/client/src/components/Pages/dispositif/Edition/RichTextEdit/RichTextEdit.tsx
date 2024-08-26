import Button from "@/components/UI/Button";
import { Event } from "@/lib/tracking";
import PageContext from "@/utils/pageContext";
import dynamic from "next/dynamic";
import { useCallback, useContext, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import AddContentButton from "../AddContentButton";

const RichTextInput = dynamic(() => import("components/UI/RichTextInput"), { ssr: false });

interface Props {
  id: string;
}

/**
 * Form component for a rich text.
 * Shows either an AddContentButton if the section in not active, or a the rich text editor if it is.
 */
const RichTextEdit = (props: Props) => {
  const [isActive, setIsActive] = useState(false);
  const formContext = useFormContext();

  const { setActiveSection, activeSection } = useContext(PageContext);
  useEffect(() => {
    if (isActive) {
      setActiveSection?.(props.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, props.id]);

  useEffect(() => {
    if (activeSection !== props.id) {
      setIsActive(false);
    }
  }, [activeSection, props.id]);

  const closeSection = useCallback(
    (e: any) => {
      e.preventDefault();
      setIsActive(false);
      setActiveSection?.("");
      Event("DISPO_CREATE", "close section", "Section");
    },
    [setActiveSection],
  );

  return (
    <div id={`step-${props.id}`}>
      {!isActive && (
        <AddContentButton onClick={() => setIsActive(true)} content={formContext.getValues(props.id)}>
          Description synthétique de l’action proposée
        </AddContentButton>
      )}
      {isActive && (
        <>
          <RichTextInput
            value={formContext.getValues(props.id) || ""}
            onChange={(html) => formContext.setValue(props.id, html)}
          />
          <div className="text-end mt-6">
            <Button evaIcon="checkmark-circle-2" onClick={closeSection}>
              Fermer la section
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default RichTextEdit;
