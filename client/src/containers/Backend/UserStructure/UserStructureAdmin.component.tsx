import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { UserStructureLoading } from "./components/UserStructureLoading";
import { UserStructureDetails } from "./components/UserStructureDetails";
import { colors } from "colors";
import { userSelector } from "services/User/user.selectors";
import API from "utils/API";
import Swal from "sweetalert2";
import { GetStructureResponse, Id } from "api-types";

declare const window: Window;

export interface Props {
  location: any;
  title: string;
}

export const UserStructureAdminComponent = (props: Props) => {
  const [structure, setStructure] = useState<null | GetStructureResponse>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [reload, setReload] = useState(false);

  const toggleReload = () => setReload(!reload);
  const user = useSelector(userSelector);

  useEffect(() => {
    document.title = props.title;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const searchParams = new URL(document.location.href).searchParams;
    const structureId = searchParams.get("id");

    const loadStructure = async () => {
      if (structureId) {
        setIsLoading(true);
        const data = await API.getStructureById(structureId, "fr");
        setStructure(data.data.data);
        setIsLoading(false);
      }
    };

    loadStructure();
    window.scrollTo(0, 0);
  }, [reload]);

  const membres = structure ? structure.membres : [];

  const addUserInStructure = async (userId: Id) => {
    if (!structure) return;
    const query = {
      membreId: userId,
      structureId: structure._id,
      action: "create",
      role: "contributeur"
    };
    setIsLoading(true);
    await API.modifyUserRoleInStructure({ query });
    setIsLoading(false);
    toggleReload();
  };

  const modifyRole = async (userId: Id, role: "contributeur" | "administrateur") => {
    if (!structure) return;
    const query = {
      membreId: userId,
      structureId: structure._id,
      action: "modify",
      role
    };
    setIsLoading(true);
    await API.modifyUserRoleInStructure({ query });
    setIsLoading(false);
    toggleReload();
  };

  const deleteUserFromStructure = async (userId: Id) => {
    if (!structure) return;

    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous êtes sur le point d'enlever un membre de votre structure.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, l'enlever",
      cancelButtonText: "Annuler"
    }).then(async (result) => {
      if (result.value) {
        const query = {
          membreId: userId,
          structureId: structure._id,
          action: "delete"
        };
        setIsLoading(true);
        await API.modifyUserRoleInStructure({ query });
        setIsLoading(false);
        toggleReload();
      }
    });
  };

  if (isLoading) {
    return <UserStructureLoading />;
  }

  if (!structure) return <div>No structure</div>;

  return (
    <UserStructureDetails
      picture={structure.picture || null}
      name={structure.nom}
      acronyme={structure.acronyme || ""}
      membres={membres}
      userId={user.userId}
      structureId={structure._id}
      addUserInStructure={addUserInStructure}
      isAdmin={user.admin}
      modifyRole={modifyRole}
      deleteUserFromStructure={deleteUserFromStructure}
    />
  );
};
