import Button from "@codegouvfr/react-dsfr/Button";
import { SideMenu } from "@codegouvfr/react-dsfr/SideMenu";
import router from "next/router";
import { useTranslation } from "react-i18next";
import DropDown from "~/components/UI/DropDown/DropDown";
import { getPath } from "~/routes";

const LanguageSelect = () => {
  const { t } = useTranslation();

  return (
    <div>
      <Button
        linkProps={{
          href: getPath("/traduire", router.locale),
          prefetch: false,
        }}
        iconId="fr-icon-message-2-line"
        priority="tertiary"
      >
        {t("Toolbar.Traduire", "Traduire")}
      </Button>

      <DropDown open={true} setOpen={() => {}} label="Dans cette rubrique">
        <SideMenu
          align="left"
          burgerMenuButtonText="Dans cette rubrique"
          items={[
            {
              isActive: true,
              linkProps: {
                href: "#",
              },
              text: <span>Huhu</span>,
            },
            {
              linkProps: {
                href: "#",
              },
              text: "Accès direct",
            },
            {
              linkProps: {
                href: "#",
              },
              text: "Accès direct",
            },
            {
              linkProps: {
                href: "#",
              },
              text: "Accès direct",
            },
            {
              linkProps: {
                href: "#",
              },
              text: "Accès direct",
            },
            {
              linkProps: {
                href: "#",
              },
              text: "Accès direct",
            },
          ]}
        />
      </DropDown>

      <SideMenu
        align="left"
        burgerMenuButtonText="Dans cette rubrique"
        items={[
          {
            isActive: true,
            linkProps: {
              href: "#",
            },
            text: <span>Huhu</span>,
          },
          {
            linkProps: {
              href: "#",
            },
            text: "Accès direct",
          },
          {
            linkProps: {
              href: "#",
            },
            text: "Accès direct",
          },
          {
            linkProps: {
              href: "#",
            },
            text: "Accès direct",
          },
          {
            linkProps: {
              href: "#",
            },
            text: "Accès direct",
          },
          {
            linkProps: {
              href: "#",
            },
            text: "Accès direct",
          },
        ]}
      />
    </div>
  );
};

export { LanguageSelect };
