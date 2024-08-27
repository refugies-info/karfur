import { useDispatch, useSelector } from "react-redux";
import useToggle from "react-use/lib/useToggle";
import { nbContentsSelector } from "~/services/redux/Contents/contents.selectors";
import { saveUserLocalizedWarningHiddenActionCreator } from "~/services/redux/User/user.actions";
import { isLocalizedWarningHiddenSelector, userLocationSelector } from "~/services/redux/User/user.selectors";
import LocationWarningMessage from "./LocationWarningMessage";
import LocationWarningModal from "./LocationWarningModal";

const MAX_CONTENT_LOCALIZED = 10;

/**
 * Show a warning to the user if his current location is not fully deployed
 * (ie. the number of content his lower than MAX_CONTENT_LOCALIZED)
 *
 */
const LocationWarning = () => {
  const dispatch = useDispatch();
  const nbContents = useSelector(nbContentsSelector);
  const selectedLocation = useSelector(userLocationSelector);

  // The user hide this warning before
  const isLocalizedWarningHidden = useSelector(isLocalizedWarningHiddenSelector);

  const [isLocalizedModalVisible, toggleIsLocalizedModalVisible] = useToggle(false);

  const totalContent = (nbContents.nbGlobalContent || 0) + (nbContents.nbLocalizedContent || 0);
  const isLocalizedWarningVisible = !!(
    !isLocalizedWarningHidden &&
    selectedLocation.city &&
    nbContents.nbLocalizedContent !== null &&
    nbContents.nbLocalizedContent < MAX_CONTENT_LOCALIZED
  );

  if (!isLocalizedWarningVisible) return null;

  return (
    <>
      <LocationWarningMessage
        totalContent={totalContent}
        city={selectedLocation.city || ""}
        onPress={toggleIsLocalizedModalVisible}
        onClose={() => dispatch(saveUserLocalizedWarningHiddenActionCreator())}
      />
      <LocationWarningModal
        isVisible={isLocalizedModalVisible}
        closeModal={toggleIsLocalizedModalVisible}
        nbGlobalContent={nbContents.nbGlobalContent || 0}
        nbLocalizedContent={nbContents.nbLocalizedContent || 0}
        city={selectedLocation.city || ""}
      />
    </>
  );
};

export default LocationWarning;
