// import original module declarations
import "styled-components/native";
import { styles as theme } from "../theme";

type ThemeInterface = typeof theme;

// and extend them!
declare module "styled-components/native" {
  export interface DefaultTheme extends ThemeInterface {
    i18n: {
      isRTL: boolean;
    };
  }
}
