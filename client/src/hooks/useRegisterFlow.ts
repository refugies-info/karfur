import { useEffect, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RoleName } from "@refugies-info/api-types";
import { useRouter } from "next/router";
import { getPath } from "routes";
import { setAuthToken } from "utils/authToken";
import { fetchUserActionCreator } from "services/User/user.actions";
import { userDetailsSelector } from "services/User/user.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";

type Step = "objectif" | "partenaire" | "langue" | "pseudo" | "territoire";

const useRegisterFlow = (currentStep: Step | null) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const userDetails = useSelector(userDetailsSelector);
  const isUserLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));

  useEffect(() => {
    if (currentStep && !userDetails && !isUserLoading) dispatch(fetchUserActionCreator());
  }, [userDetails, isUserLoading, currentStep, dispatch]);

  /**
   * Return the registration flow depending on the role
   */
  const getAllSteps = useCallback((roles: RoleName[]): Step[] => {
    if (roles.includes(RoleName.TRAD)) return ["objectif", "langue", "pseudo", "territoire"];
    if (roles.includes(RoleName.CAREGIVER)) return ["objectif", "partenaire", "territoire"]
    if (roles.includes(RoleName.CONTRIB)) return ["objectif", "pseudo", "territoire"]
    return ["objectif", "territoire"]
  }, []);

  /**
   * @returns [currentStep, stepCount]
   */
  const getStepCount = useCallback((currentRoles: RoleName[] | null): [number, number] => {
    const roles = currentRoles || (userDetails?.roles || []).map(r => r.nom);
    const allSteps = getAllSteps(roles);
    const currentStepIndex = currentStep === null ? -1 : allSteps.indexOf(currentStep);
    return [currentStepIndex + 1, allSteps.length];
  }, [userDetails, currentStep, getAllSteps]);

  /**
   * Returns the next step, can be used to redirect user
   */
  const next = useCallback((currentRoles: RoleName[] | null) => {
    const roles = currentRoles || (userDetails?.roles || []).map(r => r.nom);
    const allSteps = getAllSteps(roles);
    const currentStepIndex = currentStep === null ? -1 : allSteps.indexOf(currentStep);
    let nextStep = allSteps[currentStepIndex + 1];

    // If already a role, skip "objectif" step
    if (nextStep === "objectif" && roles.find(r => [RoleName.TRAD, RoleName.CAREGIVER, RoleName.CONTRIB].includes(r))) {
      nextStep = allSteps[currentStepIndex + 2];
    }

    if (nextStep) router.push(getPath(`/auth/inscription/${nextStep}`, "fr"));
  }, [userDetails, currentStep, getAllSteps, router]);


  const back = useCallback(() => {
    const roles = (userDetails?.roles || []).map(r => r.nom);
    const allSteps = getAllSteps(roles);
    if (currentStep === null || currentStep === "objectif") return;
    const currentStepIndex = allSteps.indexOf(currentStep);
    const previousStep = allSteps[currentStepIndex - 1];

    if (previousStep) router.push(getPath(`/auth/inscription/${previousStep}`, "fr"))
    else router.back()
  }, [router, userDetails, currentStep, getAllSteps]);

  const start = (token: string, role: RoleName | undefined) => {
    setAuthToken(token);
    dispatch(fetchUserActionCreator());
    next([role || RoleName.USER]);
  }

  return { userId: userDetails?._id, userDetails, getStepCount, next, back, start };
}

export default useRegisterFlow;
