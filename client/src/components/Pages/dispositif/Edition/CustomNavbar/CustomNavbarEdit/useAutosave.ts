import { useContext, useEffect, useMemo, useState } from "react";
import { DeepPartialSkipArrayKey, useFormContext, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import debounce from "lodash/debounce";
import { CreateDispositifRequest, DispositifStatus } from "api-types";
import { getPath } from "routes";
import { submitCreateForm, submitUpdateForm } from "lib/dispositifForm";
import PageContext from "utils/pageContext";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { setSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";

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
          debouncedSave(async () => {
            setIsSaving(true);
            if (id) { // update
              await submitUpdateForm(id, data);
              if (dispositif?.status === DispositifStatus.ACTIVE && !dispositif?.hasDraftVersion) { // TODO: return from API? quick fix here
                dispatch(setSelectedDispositifActionCreator({ ...dispositif, status: DispositifStatus.DRAFT, hasDraftVersion: true }))
              }
            } else { // create
              const res = await submitCreateForm(data);
              const path = router.pathname === "/demarche" ? "/demarche/[id]/edit" : "/dispositif/[id]/edit";
              router.replace({
                pathname: getPath(path, router.locale),
                query: { id: res.data.data.id.toString() },
              });
            }
            setIsSaving(false);
          });
        })();
        setOldData(data);
      }
    }
  }, [pageContext.mode, id, methods, data, oldData, router, dispositif, dispatch]);

  return { isSaving };
}

export default useAutosave;
