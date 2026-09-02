import API from "~/utils/API";
import useThrottledEmail from "./useThrottledEmail";

/** Password reset link send, throttled to one email per minute and per address. */
const useResetPasswordMail = (email: string) => {
  const { sendEmail, secondsLeft, canSend } = useThrottledEmail(
    "reset-password",
    email,
    (address) => API.resetPassword({ email: address }),
  );

  return { sendResetPasswordMail: sendEmail, secondsLeft, canSendResetPasswordMail: canSend };
};

export default useResetPasswordMail;
