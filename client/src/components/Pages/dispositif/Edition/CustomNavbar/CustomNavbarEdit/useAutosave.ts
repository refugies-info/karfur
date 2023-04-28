import { useContext, useEffect, useMemo, useState } from "react";
import { DeepPartialSkipArrayKey, useFormContext, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";
import { CreateDispositifRequest, PostDispositifsResponse, UpdateDispositifResponse } from "api-types";
import { getPath } from "routes";
import { submitCreateForm, submitUpdateForm } from "lib/dispositifForm";
import PageContext from "utils/pageContext";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { setSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import { addToAllStructuresActionCreator } from "services/AllStructures/allStructures.actions";

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

  useEffect(() => {
    if (pageContext.mode === "edit") {
      if (JSON.stringify(data) !== JSON.stringify(oldData)) { // form has changed
        methods.handleSubmit((data: CreateDispositifRequest) => {
          setOldData(data);

          debouncedSave(async () => {
            setIsSaving(true);
            let response: UpdateDispositifResponse | PostDispositifsResponse | null = null;

            if (id) { // update
              response = await submitUpdateForm(id, data).then(res => res.data.data);
              if (response && dispositif) {
                dispatch(setSelectedDispositifActionCreator({ ...dispositif, status: response.status, hasDraftVersion: response.hasDraftVersion }))
              }
            } else { // create
              response = await submitCreateForm(data).then(res => res.data.data);
              if (response) {
                // TODO: use response to setSelectedDispositif and no redirect?
                const path = router.pathname === "/demarche" ? "/demarche/[id]/edit" : "/dispositif/[id]/edit";
                router.replace({
                  pathname: getPath(path, router.locale),
                  query: { id: response.id.toString() },
                });
              }
            }

            // update form data
            const updatedOldData: FormValues = { ...data };
            // if main sponsor is a new one (= type object)
            if (!!response?.mainSponsor && typeof data.mainSponsor !== "string") {
              methods.setValue("mainSponsor", response.mainSponsor); // set the id in the form values to prevent from creating multiple ones
              dispatch(addToAllStructuresActionCreator({ // add it to structures list
                _id: response.mainSponsor,
                nom: data.mainSponsor?.name,
                picture: data.mainSponsor?.logo
              }));
              updatedOldData.mainSponsor = response.mainSponsor; // update old data not to restart submit
            }

            // remove contact infos to prevent from adding multiple logs
            if (data.contact) {
              methods.setValue("contact", undefined);
              updatedOldData.contact = undefined;
            }
            setOldData(updatedOldData);
            setIsSaving(false);
          });
        })();
      }
    }
  }, [pageContext.mode, id, methods, data, oldData, router, dispositif, dispatch]);

  return { isSaving };
}

export default useAutosave;
