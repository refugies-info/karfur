import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useCookie } from "react-use";
import { ContentType } from "@refugies-info/api-types";
import { getPath } from "routes";
import { Event } from "lib/tracking";
import API from "utils/API";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";

const useSendSms = () => {
  const [utmz] = useCookie("__utmz");
  const dispositif = useSelector(selectedDispositifSelector);

  const sendSMS = useCallback((tel: string, ln: string) => {
    Event("SEND_SMS", ln, "Dispo View");
    const campaign = utmz
      ?.split("&")
      .filter((it) => it.startsWith("utm_campaign"))
      .pop();
    return API.smsContentLink({
      phone: tel,
      id: dispositif?._id.toString() || "",
      url: `https://refugies.info/${ln}${getPath(
        dispositif?.typeContenu === ContentType.DEMARCHE ? "/demarche/[id]" : "/dispositif/[id]",
        ln,
      ).replace("[id]", dispositif?._id.toString() || "")}${campaign ? `?utm_source=twilio&utm_medium=sms&${campaign}` : ""
        }`,
      locale: ln,
    });
  }, [dispositif, utmz]);
  return { sendSMS };
};

export default useSendSms;
