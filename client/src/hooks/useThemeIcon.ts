import { useState, useEffect } from "react";
import { Theme } from "types/interface";


const useThemeIcon = (theme: Theme | undefined | null, size: number) => {
  const [imgXml, setImgXml] = useState(`<svg width="${size}" height="${size}"></svg>`);
  const [hasBeenFetched, setHasBeenFetched] = useState(false);

  // TODO: improve to prevent multiple fetch
  useEffect(() => {
    const getImgXml = async () => {
      if (!theme) return;
      const itemKey = theme.short.fr;
      let xml = sessionStorage.getItem(itemKey);
      if (!xml) {
        xml = await (await fetch(theme.icon.secure_url)).text();
        sessionStorage.setItem(itemKey, xml);
      }
      setHasBeenFetched(true);
      setImgXml(xml);
    };
    getImgXml();
  }, [theme]);

  return {imgXml, hasBeenFetched};
}

export default useThemeIcon;
