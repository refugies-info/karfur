import React from "react";
import { useWatch } from "react-hook-form";
import { Id } from "api-types";
import Banner from "../../Banner";

const BannerEdition = () => {
  const themeId = useWatch<Id>({ name: "theme" });
  return <Banner themeId={themeId} />;
};

export default BannerEdition;
