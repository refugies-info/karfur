import marioProfile from "assets/mario-profile.jpg";
import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/fr";
import { useDispatch } from "react-redux";
import {
  SearchBarContainer,
  StyledHeader,
  StyledTitle,
  FigureContainer,
  StyledSort,
  Content,
  StyledHeaderInner
} from "../sharedComponents/StyledAdmin";
import Image from "next/legacy/image";
import { useRouter } from "next/router";
import useRouterLocale from "hooks/useRouterLocale";
import { userHeaders, correspondingStatus } from "./data";
import { Table, Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { activeUsersSelector } from "services/AllUsers/allUsers.selector";
import { TabHeader, FilterButton } from "../sharedComponents/SubComponents";
import { RowContainer, StructureName } from "../AdminStructures/components/AdminStructureComponents";
import { Role, LangueFlag } from "./ components/AdminUsersComponents";
import { LoadingAdminUsers } from "./ components/LoadingAdminUsers";
import { CustomSearchBar } from "components/Frontend/Dispositif/CustomSeachBar/CustomSearchBar";
import { SimplifiedUser, UserStatusType } from "types/interface";
import { prepareDeleteContrib } from "../Needs/lib";
import { NeedsChoiceModal } from "../AdminContenu/NeedsChoiceModal/NeedsChoiceModal";
import { ChangeStructureModal } from "../AdminContenu/ChangeStructureModale/ChangeStructureModale";
import { ImprovementsMailModal } from "../AdminContenu/ImprovementsMailModal/ImprovementsMailModal";
import { removeAccents } from "lib";
import { ObjectId } from "mongodb";
import { UserDetailsModal } from "./UserDetailsModal/UserDetailsModal";
import { StructureDetailsModal } from "../AdminStructures/StructureDetailsModal/StructureDetailsModal";
import { SelectFirstResponsableModal } from "../AdminStructures/SelectFirstResponsableModal/SelectFirstResponsableModal";
import { setAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import FButton from "components/UI/FButton/FButton";
import API from "utils/API";
import Swal from "sweetalert2";
import { ContentDetailsModal } from "../AdminContenu/ContentDetailsModal/ContentDetailsModal";
import styles from "./AdminUsers.module.scss";
import { statusCompare } from "lib/statusCompare";
import { getAdminUrlParams, getInitialFilters } from "lib/getAdminUrlParams";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";

moment.locale("fr");

export const AdminUsers = () => {
  const defaultSortedHeader = {
    name: "none",
    sens: "none",
    orderColumn: "none"
  };

  // filters
  const router = useRouter();
  const locale = useRouterLocale();
  const initialFilters = getInitialFilters(router, "utilisateurs");
  const [filter, setFilter] = useState<UserStatusType>((initialFilters.filter as UserStatusType) || "Admin");
  const [sortedHeader, setSortedHeader] = useState(defaultSortedHeader);
  const [search, setSearch] = useState("");

  // modals
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(!!initialFilters.selectedUserId);
  const [showStructureDetailsModal, setShowStructureDetailsModal] = useState(!!initialFilters.selectedStructureId);
  const [showContentDetailsModal, setShowContentDetailsModal] = useState(!!initialFilters.selectedDispositifId);
  const [showSelectFirstRespoModal, setSelectFirstRespoModal] = useState(false);
  const [showImprovementsMailModal, setShowImprovementsMailModal] = useState(false);
  const [showChangeStructureModal, setShowChangeStructureModal] = useState(false);
  const [showNeedsChoiceModal, setShowNeedsChoiceModal] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<ObjectId | null>(initialFilters.selectedUserId);
  const [selectedStructureId, setSelectedStructureId] = useState<ObjectId | null>(initialFilters.selectedStructureId);
  const [selectedContentId, setSelectedContentId] = useState<ObjectId | null>(initialFilters.selectedDispositifId);
  const [selectedContentStatus, setSelectedContentStatus] = useState<string | null>(null);
  const [isExportLoading, setIsExportLoading] = useState(false);

  const dispatch = useDispatch();

  // update route params
  useEffect(() => {
    if (router.query.tab === "utilisateurs") {
      const params = getAdminUrlParams(
        router.query.tab,
        filter,
        selectedUserId,
        selectedContentId,
        selectedStructureId
      );

      router.replace(
        {
          pathname: locale + "/backend/admin",
          search: params
        },
        undefined,
        { shallow: true }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, router.query.tab, selectedUserId, selectedContentId, selectedStructureId]);

  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_USERS));

  const handleChange = (e: any) => setSearch(e.target.value);

  const toggleNeedsChoiceModal = () => setShowNeedsChoiceModal(!showNeedsChoiceModal);

  const toggleShowChangeStructureModal = () => setShowChangeStructureModal(!showChangeStructureModal);
  const toggleImprovementsMailModal = () => setShowImprovementsMailModal(!showImprovementsMailModal);

  const toggleUserDetailsModal = () => setShowUserDetailsModal(!showUserDetailsModal);

  const toggleContentDetailsModal = () => setShowContentDetailsModal(!showContentDetailsModal);

  const setSelectedUserIdAndToggleModal = (userId: ObjectId | null) => {
    setSelectedUserId(userId);
    toggleUserDetailsModal();
  };

  const setSelectedContentIdAndToggleModal = (element: ObjectId | null, status: string | null = null) => {
    setSelectedContentId(element ? element : null);
    if (status) setSelectedContentStatus(status);
    toggleContentDetailsModal();
  };

  const onFilterClick = (status: UserStatusType) => {
    setFilter(status);
    setSortedHeader(defaultSortedHeader);
  };

  const toggleStructureDetailsModal = () => setShowStructureDetailsModal(!showStructureDetailsModal);

  const setSelectedStructureIdAndToggleModal = (structureId: ObjectId | null) => {
    setSelectedStructureId(structureId);
    toggleStructureDetailsModal();
  };

  const users = useSelector(activeUsersSelector);
  const dispositifs = useSelector(allDispositifsSelector);

  const reorder = (element: { name: string; order: string }) => {
    if (sortedHeader.name === element.name) {
      const sens = sortedHeader.sens === "up" ? "down" : "up";
      setSortedHeader({ name: element.name, sens, orderColumn: element.order });
    } else {
      setSortedHeader({
        name: element.name,
        sens: "up",
        orderColumn: element.order
      });
    }
  };
  const filterAndSortUsers = (users: SimplifiedUser[]) => {
    const usersFilteredBySearch = !!search
      ? users.filter(
          (user) =>
            user.username &&
            user.username &&
            removeAccents(user.username)
              .normalize("NFD")
              .replace(/[\u0300-\u036f]/g, "")
              .toLowerCase()
              .includes(removeAccents(search.toLowerCase()))
        )
      : users;

    let filteredUsers = usersFilteredBySearch;
    if (filter === "Admin") {
      filteredUsers = usersFilteredBySearch.filter((user) => (user.roles || []).includes("Admin"));
    } else if (filter === "Respo") {
      filteredUsers = usersFilteredBySearch.filter((user) => (user.roles || []).includes("Responsable"));
    } else if (filter === "Experts") {
      filteredUsers = usersFilteredBySearch.filter((user) => (user.roles || []).includes("ExpertTrad"));
    } else if (filter === "Traducteurs") {
      filteredUsers = usersFilteredBySearch.filter((user) => user.langues && user.langues.length > 0);
    } else if (filter === "Rédacteurs") {
      filteredUsers = usersFilteredBySearch.filter((user) => (user.roles || []).includes("Rédacteur"));
    } else if (filter === "Multi-structure") {
      filteredUsers = usersFilteredBySearch.filter((user) => (user.nbStructures || 0) > 1);
    }

    if (sortedHeader.name === "none")
      return {
        usersToDisplay: filteredUsers,
        usersForCount: usersFilteredBySearch
      };

    const usersToDisplay = filteredUsers.sort((a: SimplifiedUser, b: SimplifiedUser) => {
      // @ts-ignore
      const orderColumn: "pseudo" | "email" | "structure" | "created_at" = sortedHeader.orderColumn;

      if (!a.structures || !b.structures) return 0;
      if (orderColumn === "structure") {
        const structureA = a.structures.length > 0 && a.structures[0].nom ? a.structures[0].nom : "";
        const structureB = b.structures.length > 0 && b.structures[0].nom ? b.structures[0].nom : "";

        if (structureA > structureB) return sortedHeader.sens === "up" ? 1 : -1;
        return sortedHeader.sens === "up" ? -1 : 1;
      }

      if (orderColumn === "created_at") {
        if (moment(a.created_at).diff(moment(b.created_at)) > 0) return sortedHeader.sens === "up" ? 1 : -1;
        return sortedHeader.sens === "up" ? -1 : 1;
      }

      // @ts-ignore
      const valueA = a[orderColumn] ? a[orderColumn].toLowerCase() : "";
      // @ts-ignore
      const valueAWithoutAccent = valueA.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      // @ts-ignore
      const valueB = b[orderColumn] ? b[orderColumn].toLowerCase() : "";
      const valueBWithoutAccent = valueB.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      if (valueAWithoutAccent > valueBWithoutAccent) return sortedHeader.sens === "up" ? 1 : -1;

      return sortedHeader.sens === "up" ? -1 : 1;
    });
    return {
      usersToDisplay,
      usersForCount: usersFilteredBySearch
    };
  };

  const exportToAirtable = async () => {
    try {
      setIsExportLoading(true);
      await API.exportUsers();
      setIsExportLoading(false);

      Swal.fire({
        title: "Yay...",
        text: `Export en cours de ${users ? users.length : 0} users`,
        type: "success",
        timer: 1500
      });
    } catch (error) {
      Swal.fire({
        title: "Oh non!",
        text: "Something went wrong",
        type: "error",
        timer: 1500
      });
    }
  };

  const getNbUsersByStatus = (users: SimplifiedUser[], status: string) => {
    if (status === "Admin") {
      return users.filter((user) => (user.roles || []).includes("Admin")).length;
    }
    if (status === "Respo") {
      return users.filter((user) => (user.roles || []).includes("Responsable")).length;
    }
    if (status === "Experts") {
      return users.filter((user) => (user.roles || []).includes("ExpertTrad")).length;
    }
    if (status === "Traducteurs") {
      return users.filter((user) => user.langues && user.langues.length > 0).length;
    }
    if (status === "Rédacteurs") {
      return users.filter((user) => (user.roles || []).includes("Rédacteur")).length;
    }
    if (status === "Multi-structure") {
      return users.filter((user) => (user.nbStructures || 0) > 1).length;
    }
    return users.length;
  };
  const { usersToDisplay, usersForCount } = filterAndSortUsers(users);
  if (isLoading || users.length === 0) {
    return <LoadingAdminUsers />;
  }
  return (
    <div className={styles.container}>
      <StyledHeader>
        <StyledHeaderInner>
          <StyledTitle>Utilisateurs</StyledTitle>
          <FigureContainer>{users.length}</FigureContainer>
        </StyledHeaderInner>
        <StyledSort>
          {process.env.NEXT_PUBLIC_REACT_APP_ENV === "production" && (
            <FButton type="dark" className="mr-8" onClick={exportToAirtable}>
              {isExportLoading ? <Spinner /> : "Exporter dans Airtable"}
            </FButton>
          )}
          <CustomSearchBar
            value={search}
            // @ts-ignore
            onChange={handleChange}
            placeholder="Rechercher un utilisateur..."
            withMargin={true}
          />
        </StyledSort>
      </StyledHeader>
      <StyledHeader>
        <StyledSort>
          {correspondingStatus.sort(statusCompare).map((element) => {
            const status = element.storedStatus;
            const nbUsers = getNbUsersByStatus(usersForCount, status);
            return (
              <FilterButton
                key={status}
                onClick={() => onFilterClick(status)}
                text={`${status} (${nbUsers})`}
                isSelected={filter === status}
              />
            );
          })}
        </StyledSort>
      </StyledHeader>
      <Content>
        <Table responsive borderless>
          <thead>
            <tr>
              {userHeaders.map((element, key) => (
                <th
                  key={key}
                  onClick={() => {
                    reorder(element);
                  }}
                >
                  <TabHeader
                    name={element.name}
                    order={element.order}
                    isSortedHeader={sortedHeader.name === element.name}
                    sens={sortedHeader.name === element.name ? sortedHeader.sens : "down"}
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {usersToDisplay.map((element, key) => {
              const secureUrl =
                element && element.picture && element.picture.secure_url ? element.picture.secure_url : marioProfile;
              return (
                <tr key={key}>
                  <td className="align-middle" onClick={() => setSelectedUserIdAndToggleModal(element._id)}>
                    <div style={{ maxWidth: "300px", overflow: "hidden" }}>
                      <RowContainer>
                        <Image
                          className={styles.user_img + " mr-8"}
                          src={secureUrl}
                          alt=""
                          width={40}
                          height={40}
                          objectFit="contain"
                        />
                        <StructureName className="ml-4">{element.username}</StructureName>
                      </RowContainer>
                    </div>
                  </td>
                  <td className="align-middle" onClick={() => setSelectedUserIdAndToggleModal(element._id)}>
                    <div style={{ maxWidth: "200px", wordWrap: "break-word" }}>{element.email}</div>
                  </td>

                  <td
                    className={"align-middle "}
                    onClick={() =>
                      setSelectedStructureIdAndToggleModal(
                        //@ts-ignore
                        element.structures && element.structures.length > 0 ? element.structures[0]._id : null
                      )
                    }
                  >
                    {element.structures && element.structures.length > 0 && element.structures[0].nom}
                  </td>
                  <td className="align-middle" onClick={() => setSelectedUserIdAndToggleModal(element._id)}>
                    <div className={styles.item_container}>
                      {(element.roles || []).map((role) => (
                        <Role key={role} role={role} />
                      ))}
                    </div>
                  </td>
                  <td className="align-middle" onClick={() => setSelectedUserIdAndToggleModal(element._id)}>
                    <div className={styles.item_container}>
                      {(element.langues || []).map((langue) => (
                        <LangueFlag langue={langue.langueCode} key={langue.langueCode} />
                      ))}
                    </div>
                  </td>

                  <td className="align-middle" onClick={() => setSelectedUserIdAndToggleModal(element._id)}>
                    {element.created_at ? moment(element.created_at).format("LLL") : "Non connue"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Content>
      <UserDetailsModal
        show={showUserDetailsModal}
        toggleModal={() => setSelectedUserIdAndToggleModal(null)}
        selectedUserId={selectedUserId}
        setSelectedStructureIdAndToggleModal={setSelectedStructureIdAndToggleModal}
      />

      {selectedStructureId && (
        <StructureDetailsModal
          show={showStructureDetailsModal}
          toggleModal={() => setSelectedStructureIdAndToggleModal(null)}
          selectedStructureId={selectedStructureId}
          toggleRespoModal={() => setSelectFirstRespoModal(true)}
          setSelectedUserIdAndToggleModal={setSelectedUserIdAndToggleModal}
          setSelectedContentIdAndToggleModal={setSelectedContentIdAndToggleModal}
        />
      )}
      {selectedStructureId && (
        <SelectFirstResponsableModal
          show={showSelectFirstRespoModal}
          toggleModal={() => setSelectFirstRespoModal(false)}
          selectedStructureId={selectedStructureId}
        />
      )}
      {selectedContentId && (
        <ContentDetailsModal
          show={showContentDetailsModal}
          setSelectedStructureIdAndToggleModal={setSelectedStructureIdAndToggleModal}
          toggleModal={() => setSelectedContentIdAndToggleModal(null)}
          selectedDispositifId={selectedContentId}
          setSelectedUserIdAndToggleModal={setSelectedUserIdAndToggleModal}
          onDeleteClick={() =>
            prepareDeleteContrib(dispositifs, setAllDispositifsActionsCreator, dispatch, selectedContentId)
          }
          toggleNeedsChoiceModal={toggleNeedsChoiceModal}
          toggleImprovementsMailModal={toggleImprovementsMailModal}
          setShowChangeStructureModal={setShowChangeStructureModal}
        />
      )}
      {showImprovementsMailModal && (
        <ImprovementsMailModal
          show={showImprovementsMailModal}
          toggleModal={toggleImprovementsMailModal}
          selectedDispositifId={selectedContentId}
        />
      )}
      {showNeedsChoiceModal && (
        <NeedsChoiceModal
          show={showNeedsChoiceModal}
          toggleModal={toggleNeedsChoiceModal}
          dispositifId={selectedContentId}
        />
      )}
      <ChangeStructureModal
        show={showChangeStructureModal}
        toggle={toggleShowChangeStructureModal}
        dispositifId={selectedContentId}
        dispositifStatus={selectedContentStatus}
      />
    </div>
  );
};
