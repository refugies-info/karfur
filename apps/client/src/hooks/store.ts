import { useDispatch, useSelector, useStore } from "react-redux";
import { AppDispatch, AppStore, RootStateInf } from "~/services/configureStore";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootStateInf>();
export const useAppStore = useStore.withTypes<AppStore>();
