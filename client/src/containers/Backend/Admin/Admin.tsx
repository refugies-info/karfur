import React, { useState, useEffect } from "react";
import { Nav, NavItem, NavLink, TabContent } from "reactstrap";
import _ from "lodash";
import { useDispatch } from "react-redux";
import { useRouter } from "next/router";
import useRouterLocale from "hooks/useRouterLocale";
import {
  fetchAllDispositifsActionsCreator,
  setAllDispositifsActionsCreator,
} from "services/AllDispositifs/allDispositifs.actions";
import {
  fetchAllStructuresActionsCreator,
  setAllStructuresActionCreator,
} from "services/AllStructures/allStructures.actions";
import {
  fetchAllUsersActionsCreator,
  setAllUsersActionsCreator,
} from "services/AllUsers/allUsers.actions";
import CustomTabPane from "components/Backend/Admin/CustomTabPane";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { colors } from "colors";
import styled from "styled-components";
import Navigation from "../Navigation";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";
import styles from "./Admin.module.scss";
import { TabQuery } from "lib/getAdminUrlParams";

const OngletText = styled.span`
  color: ${(props: {isActive: boolean}) => (props.isActive ? colors.bleuCharte : colors.gray90)};
  font-weight: ${(props: {isActive: boolean}) => (props.isActive ? "bold" : "normal")};
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
  isSelected: boolean
  iconSelected: string
  iconNotSelected: string
  text: string
}
const Onglet = (props: TabProps) => {
  return (
    <OngletContainer>
      <div style={{ width: 20, height: 20, marginRight: 8, marginBottom: 5 }}>
        {props.isSelected ?
          <EVAIcon
            key={1}
            name={props.iconSelected}
            fill={colors.bleuCharte}
          /> :
          <EVAIcon
            key={2}
            name={props.iconNotSelected}
            fill={colors.gray90}
          />
        }
      </div>
      <OngletText isActive={props.isSelected}>{props.text}</OngletText>
    </OngletContainer>
  );
}

export const Admin = () => {
  const router = useRouter();
  const locale = useRouterLocale();
  const queryTab = router.query.tab as TabQuery;
  const [activeTab, setActiveTab] = useState<TabQuery>(queryTab || "contenus");

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
    router.replace({
      pathname: locale + "/backend/admin",
      search: new URLSearchParams({ tab: tab as string }).toString(),
    }, undefined, { shallow: true });
    setActiveTab(tab);
  }

  return (
    <div className={styles.admin + " animated fadeIn"}>
      <Navigation selected="admin" />
      <Nav>
        <NavItem>
          <NavLink
            active={activeTab === "contenus"}
            onClick={() => toggleTab("contenus")}
          >
            <Onglet
              iconSelected="file-add"
              iconNotSelected="file-add-outline"
              text="Contenus"
              isSelected={activeTab === "contenus"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "structures"}
            onClick={() => toggleTab("structures")}
          >
            <Onglet
              iconSelected="shopping-bag"
              iconNotSelected="shopping-bag-outline"
              text="Structures"
              isSelected={activeTab === "structures"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "utilisateurs"}
            onClick={() => toggleTab("utilisateurs")}
          >
            <Onglet
              iconSelected="person"
              iconNotSelected="person-outline"
              text="Utilisateurs"
              isSelected={activeTab === "utilisateurs"}
            />
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            active={activeTab === "statistiques"}
            onClick={() => toggleTab("statistiques")}
          >
            <Onglet
              iconSelected="pie-chart"
              iconNotSelected="pie-chart-outline"
              text="Statistiques"
              isSelected={activeTab === "statistiques"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "besoins"}
            onClick={() => toggleTab("besoins")}
          >
            <Onglet
              iconSelected="pie-chart"
              iconNotSelected="pie-chart-outline"
              text="Besoins"
              isSelected={activeTab === "besoins"}
            />
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent
        activeTab={activeTab}
        className={styles.tab_content}
      >
        <CustomTabPane />
      </TabContent>
    </div>
  );
};
