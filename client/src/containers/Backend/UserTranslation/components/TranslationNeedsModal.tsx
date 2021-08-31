import "./TranslationNeedsModal.scss";
import React, { useEffect } from "react";
import { Modal, Table } from "reactstrap";
import styled from "styled-components";
import { userSelectedLanguageSelector } from "../../../../services/User/user.selectors";
import { useSelector, useDispatch } from "react-redux";
import { ObjectId } from "mongodb";
import { UserLanguage } from "../../../../types/interface";
import { needsSelector } from "../../../../services/Needs/needs.selectors";
import { getTag } from "../../Admin/Needs/lib";
import { TagButton } from "../../Admin/Needs/TagButton";
import { jsUcfirst } from "../../../../lib";
import { fetchNeedsActionCreator } from "../../../../services/Needs/needs.actions";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";

interface Props {
  show: boolean;
  toggle: () => void;
  getLangueId: () => ObjectId | null;
}
const Header = styled.div`
  font-weight: bold;
  font-size: 32px;
  margin-bottom: 8px;
`;

const getLangueName = (
  langueId: ObjectId | null,
  userTradLanguages: UserLanguage[]
) => {
  if (!langueId) return null;

  const langueArray = userTradLanguages.filter(
    (langue) => langue._id === langueId
  );
  if (langueArray.length > 0) return langueArray[0].langueFr;
  return null;
};

export const TranslationNeedsModal = (props: Props) => {
  const userTradLanguages = useSelector(userSelectedLanguageSelector);

  const langueId = props.getLangueId();
  const langueSelectedFr = getLangueName(langueId, userTradLanguages);
  const dispatch = useDispatch();

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_NEEDS)
  );
  useEffect(() => {
    dispatch(fetchNeedsActionCreator());
  }, []);

  const needs = useSelector(needsSelector);

  if (!langueId || !langueSelectedFr)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className="modal-besoins"
        size="lg"
      >
        Erreur
      </Modal>
    );

  if (isLoading) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggle}
        className="modal-besoins"
        size="lg"
      >
        Loading
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="modal-besoins"
      size="lg"
    >
      <Header>{"Traduction des besoins en " + langueSelectedFr}</Header>
      <Table responsive borderless>
        <thead>
          <tr>
            {["Nom du besoin", "Thème", "Traduction", "Statut"].map(
              (element, key) => (
                <th key={key}>
                  <div>{element}</div>
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {needs.map((need, key) => {
            const needTag = getTag(need.tagName);
            if (!needTag) return;
            return (
              <tr key={key}>
                <td className="align-middle" style={{ width: 300 }}>
                  {need.fr.text}
                </td>
                <td className="align-middle">
                  <div style={{ marginLeft: -4 }}>
                    <TagButton
                      name={jsUcfirst(needTag.short) || ""}
                      isSelected={true}
                      color={needTag.darkColor}
                    />
                  </div>
                </td>
                <td className="align-middle">trad</td>
                <td className="align-middle">statut</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Modal>
  );
};
