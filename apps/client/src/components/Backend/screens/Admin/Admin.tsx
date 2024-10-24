import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Nav, NavItem, NavLink, TabContent } from "reactstrap";
import styled from "styled-components";
import CustomTabPane from "~/components/Backend/CustomTabPane";
import EVAIcon from "~/components/UI/EVAIcon";
import useRouterLocale from "~/hooks/useRouterLocale";
import { getInitialTab, setSavedQuery, TabQuery } from "~/lib/getAdminUrlParams";
import {
  fetchAllDispositifsActionsCreator,
  setAllDispositifsActionsCreator,
} from "~/services/AllDispositifs/allDispositifs.actions";
import {
  fetchAllStructuresActionsCreator,
  setAllStructuresActionCreator,
} from "~/services/AllStructures/allStructures.actions";
import { fetchAllUsersActionsCreator, setAllUsersActionsCreator } from "~/services/AllUsers/allUsers.actions";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { colors } from "~/utils/colors";
import styles from "./Admin.module.scss";

const OngletText = styled.span<{ isActive: boolean }>`
  color: ${(props: { isActive: boolean }) => (props.isActive ? colors.bleuCharte : colors.gray90)};
  font-weight: ${(props: { isActive: boolean }) => (props.isActive ? "bold" : "normal")};
`;

const OngletContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 12px;
  margin-bottom: 12px;
  cursor: pointer;
  background: #f2f2f2;
`;

interface TabProps {
  isSelected: boolean;
  iconSelected: string;
  iconNotSelected: string;
  text: string;
}
const Onglet = (props: TabProps) => {
  return (
    <OngletContainer>
      <div style={{ width: 20, height: 20, marginRight: 8, marginBottom: 5 }}>
        {props.isSelected ? (
          <EVAIcon key={1} name={props.iconSelected} fill={colors.bleuCharte} />
        ) : (
          <EVAIcon key={2} name={props.iconNotSelected} fill={colors.gray90} />
        )}
      </div>
      <OngletText isActive={props.isSelected}>{props.text}</OngletText>
    </OngletContainer>
  );
};

interface Props {
  title: string;
}

export const Admin = (props: Props) => {
  const router = useRouter();
  const locale = useRouterLocale();

  // Handle initial tab
  const initialTab = getInitialTab(router);
  const [activeTab, setActiveTab] = useState<TabQuery>(initialTab);

  const redirectToTab = (tab: string) => {
    router.replace(
      {
        pathname: locale + "/backend/admin",
        search: new URLSearchParams({ tab: tab }).toString(),
      },
      undefined,
      { shallow: true },
    );
  };

  useEffect(() => {
    document.title = props.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // update url if needed on load
    if (initialTab && initialTab !== router.query.tab) {
      redirectToTab(initialTab as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // save query in localstorage
  useEffect(() => {
    setSavedQuery(window.location.search.replace("?", ""));
  }, [router.query]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchNeedsActionCreator());
    dispatch(fetchAllDispositifsActionsCreator());
    dispatch(fetchAllUsersActionsCreator());
    dispatch(fetchAllStructuresActionsCreator());

    window.scrollTo(0, 0);

    return () => {
      dispatch(setAllDispositifsActionsCreator([]));
      dispatch(setAllStructuresActionCreator([]));
      dispatch(setAllUsersActionsCreator([]));
    };
  }, [dispatch]);

  const toggleTab = (tab: TabQuery) => {
    redirectToTab(tab as string);
    setActiveTab(tab);
  };

  return (
    <div className={styles.admin + " animated fadeIn"}>
      <Nav>
        <NavItem>
          <NavLink active={activeTab === "contenus"} onClick={() => toggleTab("contenus")}>
            <Onglet
              iconSelected="file-add"
              iconNotSelected="file-add-outline"
              text="Contenus"
              isSelected={activeTab === "contenus"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === "structures"} onClick={() => toggleTab("structures")}>
            <Onglet
              iconSelected="shopping-bag"
              iconNotSelected="shopping-bag-outline"
              text="Structures"
              isSelected={activeTab === "structures"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === "utilisateurs"} onClick={() => toggleTab("utilisateurs")}>
            <Onglet
              iconSelected="person"
              iconNotSelected="person-outline"
              text="Utilisateurs"
              isSelected={activeTab === "utilisateurs"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === "categories"} onClick={() => toggleTab("categories")}>
            <Onglet
              iconSelected="settings-2"
              iconNotSelected="settings-2-outline"
              text="Catégories"
              isSelected={activeTab === "categories"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === "divers"} onClick={() => toggleTab("divers")}>
            <Onglet
              iconSelected="pie-chart"
              iconNotSelected="pie-chart-outline"
              text="Divers"
              isSelected={activeTab === "divers"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink active={activeTab === "widgets"} onClick={() => toggleTab("widgets")}>
            <Onglet
              iconSelected="code"
              iconNotSelected="code-outline"
              text="Widgets"
              isSelected={activeTab === "widgets"}
            />
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} className={styles.tab_content}>
        <CustomTabPane activeTab={activeTab} />
      </TabContent>
    </div>
  );
};
