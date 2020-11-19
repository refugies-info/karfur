import React, { useEffect } from "react";
import styled from "styled-components";
import "./AnnuaireDetail.scss";
import { ObjectId } from "mongodb";
import { fetchSelectedStructureActionCreator } from "../../../../services/SelectedStructure/selectedStructure.actions";
import { useDispatch, useSelector } from "react-redux";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { selectedStructureSelector } from "../../../../services/SelectedStructure/selectedStructure.selector";
import { Spinner } from "reactstrap";
import { LeftAnnuaireDetail } from "./components/LeftAnnuaireDetail";
import { MiddleAnnuaireDetail } from "./components/MiddleAnnuaireDetails";

interface Props {
  structureId: ObjectId;
}

const Content = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
`;

export const AnnuaireDetail = (props: Props) => {
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_SELECTED_STRUCTURE)
  );

  const structure = useSelector(selectedStructureSelector);

  const dispatch = useDispatch();
  // @ts-ignore
  const structureId =
    // @ts-ignore
    props.match && props.match.params && props.match.params.id;
  useEffect(() => {
    const loadStructure = async () => {
      await dispatch(fetchSelectedStructureActionCreator(props.structureId));
    };
    if (structureId) {
      loadStructure();
    }

    // @ts-ignore
    window.scrollTo(0, 175);
  }, [dispatch, structureId]);

  if (isLoading || !structure) {
    return <Spinner />;
  }
  return (
    <Content className="annuaire-detail">
      <LeftAnnuaireDetail structure={structure} />
      <MiddleAnnuaireDetail structure={structure} />
    </Content>
  );
};
