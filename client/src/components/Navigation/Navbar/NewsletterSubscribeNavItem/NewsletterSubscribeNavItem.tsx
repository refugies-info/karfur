import { NavItem } from "@dataesr/react-dsfr";
import { SubscribeNewsletterModal } from "components/Modals/SubscribeNewsletterModal/SubscribeNewsletterModal";
import React from "react";
import { useTranslation } from "react-i18next";
import { useToggle } from "react-use";

const NewsletterSubscribeNavItem = () => {
  const { t } = useTranslation();
  const [showSubscribeNewsletterModal, toggleSubscribeNewsletterModal] = useToggle(false);
  return (
    <>
      <NavItem
        onClick={() => toggleSubscribeNewsletterModal()}
        title={t("Footer.Je m'abonne à la newsletter", "S'inscrire à la newsletter")}
      />
      <SubscribeNewsletterModal show={showSubscribeNewsletterModal} toggle={toggleSubscribeNewsletterModal} />
    </>
  );
};

export default NewsletterSubscribeNavItem;
