import marioProfile from "@/assets/mario-profile.jpg";
import { cls } from "@/lib/classname";
import { handleApiDefaultError } from "@/lib/handleApiErrors";
import { fetchUserActionCreator } from "@/services/User/user.actions";
import { userDetailsSelector } from "@/services/User/user.selectors";
import API from "@/utils/API";
import Image from "next/image";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "reactstrap";
import styles from "./EditAvatar.module.scss";

interface Props {}

const EditAvatar = (props: Props) => {
  const dispatch = useDispatch();
  const user = useSelector(userDetailsSelector);
  const [isPictureUploading, setIsPictureUploading] = useState(false);

  const handleFileInputChange = async (e: any) => {
    if (!user) return;
    setIsPictureUploading(true);
    const formData = new FormData();
    formData.append("0", e.target.files[0]);

    try {
      const imgData = await API.postImage(formData);
      await API.updateUser(user._id, {
        user: {
          picture: imgData,
        },
        action: "modify-my-details",
      });
      dispatch(fetchUserActionCreator());
    } catch (e: any) {
      handleApiDefaultError(e);
    }
    setIsPictureUploading(false);
  };

  return (
    <div className={styles.container}>
      <div className={cls(styles.avatar, isPictureUploading && styles.loading)}>
        {isPictureUploading && <Spinner className={styles.spinner} />}
        <Image src={user?.picture?.secure_url || marioProfile} width="160" height="160" alt="user picture" />
      </div>
      <p className={cls(styles.small, "my-4")}>Votre photo apparaît sur les fiches auxquelles vous contribuez.</p>
      <button className="fr-btn fr-btn--secondary fr-btn--sm fr-icon-image-edit-line fr-btn--icon-right position-relative">
        Modifier ma photo
        <input type="file" id="avatar" onChange={handleFileInputChange} />
      </button>
    </div>
  );
};
export default EditAvatar;
