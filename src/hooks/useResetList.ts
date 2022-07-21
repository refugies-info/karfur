import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { resetReadingList } from "../services/redux/VoiceOver/voiceOver.actions";

export function useResetList() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      dispatch(resetReadingList());
    });

    return unsubscribe;
  }, [navigation]);
}