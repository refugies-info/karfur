import { Header, HeaderBody, HeaderOperator, Logo, Tool, ToolItemGroup } from "@dataesr/react-dsfr";
import { logoRI } from "assets/figma";
import { BackendNavigation } from "containers";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { getPath } from "routes";
import styled from "styled-components";
import FrontendNavigation from "./FrontendNavigation";
import { UserToolItem, SpeekToolItem, SubscribeToolItem, TranslationToolItem } from "./NavbarItems";

const LogoImage = styled(Image)`
  max-width: 80%;
`;

const Navbar = () => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <Header closeButtonLabel={t`Fermeture`}>
      <HeaderBody>
        <Logo asLink={<Link href={getPath("/", router.locale)} />} splitCharacter={10}>
          Gouvernement
        </Logo>
        <HeaderOperator>
          <LogoImage key="logo" src={logoRI} alt="logo refugies-info" />
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
