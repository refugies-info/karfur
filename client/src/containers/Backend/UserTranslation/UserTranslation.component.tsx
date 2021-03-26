/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { userFirstSelectedLanguageSelector } from "../../../services/User/user.selectors";
import { Props } from "./UserTranslation.container";

export interface PropsBeforeInjection {
  match: any;
  history: any;
}
export const UserTranslationComponent = (props: Props) => {
  const param = props.match.params.id;
  console.log("param", param);

  const userTradLanguage = useSelector(userFirstSelectedLanguageSelector);
  useEffect(() => {
    console.log("use effect");
    if (userTradLanguage && !param) {
      console.log("userTradLanguage reidrect", userTradLanguage);
      return props.history.push(
        "/backend/user-translation/" + userTradLanguage
      );
    }

    if (param && !userTradLanguage) {
      return props.history.push("/backend/user-translation");
    }
  }, [param, userTradLanguage]);

  return <div>{"Hello " + (param || "no param")}</div>;
};
