import React, { useState, useEffect } from "react";
import { Nav, NavItem, NavLink, TabContent } from "reactstrap";
import _ from "lodash";
import { useDispatch } from "react-redux";
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
  const [activeTab, setActiveTab] = useState("0");

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

  const toggleTab = (tab: string) => setActiveTab(tab);

  return (
    <div className={styles.admin + " animated fadeIn"}>
      <Navigation selected="admin" />
      <Nav>
        <NavItem>
          <NavLink
            active={activeTab === "0"}
            onClick={() => toggleTab("0")}
          >
            <Onglet
              iconSelected="file-add"
              iconNotSelected="file-add-outline"
              text="Contenus"
              isSelected={activeTab === "0"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "1"}
            onClick={() => toggleTab("1")}
          >
            <Onglet
              iconSelected="shopping-bag"
              iconNotSelected="shopping-bag-outline"
              text="Structures"
              isSelected={activeTab === "1"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "2"}
            onClick={() => toggleTab("2")}
          >
            <Onglet
              iconSelected="person"
              iconNotSelected="person-outline"
              text="Utilisateurs"
              isSelected={activeTab === "2"}
            />
          </NavLink>
        </NavItem>

        <NavItem>
          <NavLink
            active={activeTab === "3"}
            onClick={() => toggleTab("3")}
          >
            <Onglet
              iconSelected="pie-chart"
              iconNotSelected="pie-chart-outline"
              text="Statistiques"
              isSelected={activeTab === "3"}
            />
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            active={activeTab === "4"}
            onClick={() => toggleTab("4")}
          >
            <Onglet
              iconSelected="pie-chart"
              iconNotSelected="pie-chart-outline"
              text="Besoins"
              isSelected={activeTab === "4"}
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
