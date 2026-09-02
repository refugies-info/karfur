import API from "~/utils/API";
import useThrottledEmail from "./useThrottledEmail";

/** Login code send, throttled to one email per minute and per address. */
const useSendCode = (email: string) => {
  const { sendEmail, secondsLeft, canSend } = useThrottledEmail("send-code", email, (address) =>
    API.sendCode({ email: address }),
  );

  return { sendCode: sendEmail, secondsLeft, canSendCode: canSend };
};

export default useSendCode;
