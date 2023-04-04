import React from "react";
import { useSelector } from "react-redux";
import { Badge } from "@dataesr/react-dsfr";
import { Id } from "api-types";
import { themeSelector } from "services/Themes/themes.selectors";
import { userSelector } from "services/User/user.selectors";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import { getStatus } from "./functions";
import styles from "./Banner.module.scss";

interface Props {
  themeId: Id | undefined;
}

/**
 * Top level banner with theme image or default one
 */
const Banner = (props: Props) => {
  const theme = useSelector(themeSelector(props.themeId));
  const user = useSelector(userSelector);
  const dispositif = useSelector(selectedDispositifSelector);
  const status = getStatus(dispositif?.status, user.admin);

  return (
    <div
      className={styles.banner}
      style={theme?.banner.secure_url ? { backgroundImage: `url(${theme?.banner.secure_url})` } : {}}
    >
      {user && (
        <div className={styles.actions}>
          {status && <Badge text={status.text} type={status.type} hasIcon icon={status.icon} className="me-4" />}
          <Button icon="edit-outline" className={styles.edit}>
            Modifier la fiche
          </Button>
        </div>
      )}
    </div>
  );
};

export default Banner;
