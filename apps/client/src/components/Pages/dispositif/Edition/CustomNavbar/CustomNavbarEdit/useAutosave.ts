import type {
  CreateDispositifRequest,
  GetDispositifResponse,
  PostDispositifsResponse,
  UpdateDispositifResponse,
} from "@refugies-info/api-types";
import debounce from "lodash/debounce";
import { logger } from "logger";
import { useRouter } from "next/router";
import { useContext, useEffect, useMemo, useState } from "react";
import { type DeepPartialSkipArrayKey, useFormContext, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { submitCreateForm, submitUpdateForm } from "~/lib/dispositifForm";
import { addToAllStructuresActionCreator } from "~/services/AllStructures/allStructures.actions";
import { setSelectedDispositifActionCreator } from "~/services/SelectedDispositif/selectedDispositif.actions";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import PageContext from "~/utils/pageContext";

const debouncedSave = debounce((callback: () => void) => callback(), 500);

type FormValues = DeepPartialSkipArrayKey<CreateDispositifRequest>;

/**
 * Auto saves the dispositif form each time something changes
 */
const useAutosave = () => {
  const router = useRouter();
  const data: FormValues = useWatch<CreateDispositifRequest>(); // watch form data
  const [oldData, setOldData] = useState<FormValues>(data); // save previous form data to compare changes
  const dispositif = useSelector(selectedDispositifSelector);
  const dispatch = useDispatch();
  const id = useMemo(() => dispositif?._id, [dispositif]); // if id: edition, else: creation
  const methods = useFormContext<CreateDispositifRequest>();
  const pageContext = useContext(PageContext);

  const [isSaving, setIsSaving] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (pageContext.mode === "edit") {
      if (JSON.stringify(data) !== JSON.stringify(oldData)) {
        // form has changed
        methods.handleSubmit((data: CreateDispositifRequest) => {
          setOldData(data);

          debouncedSave(async () => {
            setHasError(false);
            setIsSaving(true);
            try {
              let response: UpdateDispositifResponse | PostDispositifsResponse | null = null;

              // Create a sanitized copy of the data with properly formatted sponsor logos
              const sanitizedData = { ...data };

              // Ensure sponsor logos are in the correct format (Picture object or null, never a string)
              if (sanitizedData.sponsors && Array.isArray(sanitizedData.sponsors)) {
                sanitizedData.sponsors = sanitizedData.sponsors.map((sponsor: any) => {
                  if (!sponsor) return sponsor;

                  const newSponsor = { ...sponsor };
                  // If logo is a string, convert it to a Picture object
                  if (typeof newSponsor.logo === "string") {
                    const url = newSponsor.logo;
                    const filename = url.split("/").pop();
                    // Robustly get public_id from filename by removing the extension from the last dot
                    const filenameWithoutExt = filename
                      ? filename.lastIndexOf(".") > -1
                        ? filename.substring(0, filename.lastIndexOf("."))
                        : filename
                      : null;
                    // Add the 'pictures/' prefix to match the expected format
                    const public_id = filenameWithoutExt ? `pictures/${filenameWithoutExt}` : null;
                    newSponsor.logo = {
                      secure_url: url,
                      public_id: public_id,
                      imgId: null,
                    };
                  }
                  return newSponsor;
                });
              }

              if (id) {
                // update
                response = await submitUpdateForm(id, sanitizedData);
                if (response && dispositif) {
                  dispatch(
                    setSelectedDispositifActionCreator({
                      ...dispositif,
                      status: response.status,
                      hasDraftVersion: response.hasDraftVersion,
                    }),
                  );
                }
              } else {
                // create
                response = await submitCreateForm(sanitizedData);
                if (response) {
                  // set partial dispositif in store, and continue edition on this page
                  dispatch(
                    setSelectedDispositifActionCreator({
                      _id: response.id,
                      status: response.status,
                      hasDraftVersion: response.hasDraftVersion,
                      typeContenu: response.typeContenu,
                    } as GetDispositifResponse),
                  );
                }
              }

              // update form data
              const updatedOldData: FormValues = { ...data };
              // if main sponsor is a new one (= type object)
              if (!!response?.mainSponsor && typeof data.mainSponsor !== "string") {
                methods.setValue("mainSponsor", response.mainSponsor); // set the id in the form values to prevent from creating multiple ones
                dispatch(
                  addToAllStructuresActionCreator({
                    // add it to structures list
                    _id: response.mainSponsor,
                    nom: data.mainSponsor?.name,
                    picture: data.mainSponsor?.logo,
                  }),
                );
                updatedOldData.mainSponsor = response.mainSponsor; // update old data not to restart submit
              }

              // remove contact infos to prevent from adding multiple logs
              if (data.contact) {
                methods.setValue("contact", undefined);
                updatedOldData.contact = undefined;
              }

              // remove typeContenu, only needed for creation
              if (data.typeContenu) {
                //@ts-expect-error
                methods.setValue("typeContenu", undefined);
                updatedOldData.typeContenu = undefined;
              }
              setOldData(updatedOldData);
            } catch (e: any) {
              setHasError(true);
              logger.error("[autosave] error:", e.response.data.message);
            }
            setIsSaving(false);
          });
        })();
      }
    }
  }, [pageContext.mode, id, methods, data, oldData, router, dispositif, dispatch]);

  return { isSaving, hasError };
};

export default useAutosave;
