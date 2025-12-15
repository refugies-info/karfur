import type { SimpleUser } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import AdminIcon from "~/assets/dispositif/crown-high-blue-france.svg";
import DefaultAvatar from "~/assets/dispositif/default-avatar.png";
import Image from "~/components/UI/Image";
import { getRole } from "./functions";

interface Props {
  user: SimpleUser;
}

const ContributorCard = ({ user }: Props) => {
  const { t } = useTranslation();
  const role = useMemo(() => getRole(user.roles), [user]);

  return (
    <div className="border-dsfr-border-default-grey bg-action-low-blue-france grid h-auto grid-rows-[auto_1fr_auto] items-center justify-center gap-2 border-none p-3">
      <Image
        src={user.picture?.secure_url || DefaultAvatar}
        width={64}
        height={64}
        alt=""
        className="mx-auto h-16 w-16 rounded-full object-cover"
      />
      <span className="text-default-grey mb-2 w-full text-center text-sm font-medium">
        {user.username || "Utilisateur"}
      </span>
      <span className="text-dsfr-text-mention-grey bg-action-low-blue-france-hover text-action-high-blue-france mt-auto flex w-auto items-center justify-center gap-1 rounded-2xl px-3 py-1 text-center text-sm font-normal">
        {role === "admin" && (
          <Image src={AdminIcon} width={16} height={16} alt="" className="ms-2" />
        )}
        {t(`Roles.${role}`)}
      </span>
    </div>
  );
};

export default ContributorCard;
