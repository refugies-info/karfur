import { Header, HeaderBody, HeaderOperator, Logo, Tool, ToolItemGroup } from "@dataesr/react-dsfr";
import { logoRI } from "assets/figma";
import { BackendNavigation } from "containers";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import FrontendNavigation from "./FrontendNavigation";
import { UserToolItem, SpeekToolItem, SubscribeToolItem, TranslationToolItem } from "./NavbarItems";

const Navbar = () => {
  const { t } = useTranslation();

  return (
    <Header closeButtonLabel={t`Fermeture`}>
      <HeaderBody>
        <Logo splitCharacter={10}>Gouvernement</Logo>
        <HeaderOperator>
          <Image key="logo" src={logoRI} alt="logo refugies-info" />
        </HeaderOperator>
        <Tool>
          <ToolItemGroup>
            <SpeekToolItem />
            <SubscribeToolItem />
            <UserToolItem />
            <TranslationToolItem />
          </ToolItemGroup>
        </Tool>
      </HeaderBody>
      <FrontendNavigation />
      <BackendNavigation />
    </Header>
  );
};

export default Navbar;
