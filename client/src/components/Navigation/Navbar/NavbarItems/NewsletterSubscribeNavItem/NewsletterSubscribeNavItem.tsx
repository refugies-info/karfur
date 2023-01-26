import { NavItem } from "@dataesr/react-dsfr";
import React from "react";
import { useTranslation } from "next-i18next";
import { useDispatch } from "react-redux";
import { toggleNewsletterModalAction } from "services/Miscellaneous/miscellaneous.actions";

const NewsletterSubscribeNavItem = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const onClick = () => dispatch(toggleNewsletterModalAction());
  return (
    <NavItem link="#" onClick={onClick} title={t("Toolbar.S'inscrire à la newsletter", "S'inscrire à la newsletter")} />
  );
};

NewsletterSubscribeNavItem.defaultProps = {
  __TYPE: "NavItem"
};

export default NewsletterSubscribeNavItem;
