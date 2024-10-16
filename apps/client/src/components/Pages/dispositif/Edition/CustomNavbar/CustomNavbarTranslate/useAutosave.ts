import { Languages } from "@refugies-info/api-types";
import debounce from "lodash/debounce";
import { logger } from "logger";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { DeepPartialSkipArrayKey, useFormContext, useWatch } from "react-hook-form";
import { TranslateForm } from "~/hooks/dispositif/useDispositifTranslateForm";
import API from "~/utils/API";
import PageContext from "~/utils/pageContext";

const debouncedSave = debounce((callback: () => void) => callback(), 500);

type FormValues = DeepPartialSkipArrayKey<TranslateForm>;

/**
 * Auto saves the translations form each time something changes
 */
const useAutosave = () => {
  const router = useRouter();
  const data: FormValues = useWatch<TranslateForm>(); // watch form data
  const [oldData, setOldData] = useState<FormValues>(data); // save previous form data to compare changes
  const id = useMemo(() => router.query.id as string, [router.query.id]);
  const language = useMemo(() => router.query.language as Languages, [router.query.language]);
  const methods = useFormContext<TranslateForm>();
  const pageContext = useContext(PageContext);

  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);

  const [startDate, setStartDate] = useState<Date>(new Date());
  useEffect(() => {
    setStartDate(new Date());
  }, []);

  useEffect(() => {
    if (pageContext.mode === "translate") {
      if (JSON.stringify(data) !== JSON.stringify(oldData)) {
        // form has changed
        methods.handleSubmit((data: TranslateForm) => {
          debouncedSave(async () => {
            setIsSaving(true);
            setHasError(false);
            try {
              await API.saveTraduction({
                dispositifId: id || "",
                timeSpent: new Date().getTime() - startDate.getTime(),
                translated: {
                  content: data.translated.content,
                },
                toFinish: data.toFinish,
                toReview: data.toReview,
                language: language || "",
              });
            } catch (e: any) {
              setHasError(true);
              logger.error("[autosave] error:", e.response.data.message);
            }
            setIsSaving(false);
          });
        })();
        setOldData(data);
        setStartDate(new Date());
      }
    }
  }, [pageContext.mode, id, language, methods, data, oldData, router, startDate]);

  return { isSaving, hasError };
};

export default useAutosave;
