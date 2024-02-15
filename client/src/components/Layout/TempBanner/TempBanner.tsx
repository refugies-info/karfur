import Notice from "@codegouvfr/react-dsfr/Notice";
import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "react-use";

interface Props {}

/* TODO: delete after 2024-03-16 */
const TempBanner = (props: Props) => {
  const [loaded, setLoaded] = useState(false); // use initial loading to prevent banner flash
  const [value, setValue] = useLocalStorage("showTempBanner1", true);

  useEffect(() => setLoaded(true), []);

  const showBanner = useMemo(() => {
    const limitDate = new Date("2024-03-16").getTime();
    const now = new Date().getTime();
    return loaded && value === true && limitDate > now;
  }, [loaded, value]);

  return showBanner ? (
    <Notice
      isClosable
      onClose={() => setValue(false)}
      title={
        <>
          Enquête flash : vous accompagnez des personnes réfugiées ? Aidez-nous à améliorer notre outil en partageant{" "}
          <a
            href="https://refugies.typeform.com/to/VOUndmwQ"
            target="_blank"
            rel="noopener noreferrer"
            className="text-decoration-underline"
          >
            votre expérience
          </a>
          &nbsp;!
        </>
      }
    />
  ) : null;
};

export default TempBanner;
