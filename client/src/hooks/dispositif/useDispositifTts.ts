import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useLocale from "hooks/useLocale";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import { secondaryThemesSelector, themeSelector } from "services/Themes/themes.selectors";
import { dispositifNeedsSelector } from "services/Needs/needs.selectors";
import { getAllPageReadableText } from "lib/getReadableText";
import { readAudio, stopAudio } from "lib/readAudio";
import { Event } from "lib/tracking";

/**
 * Gives methods to start and stop the TTS of the whole dispositif page
 */
const useDispositifTts = () => {
  const locale = useLocale();

  const dispositif = useSelector(selectedDispositifSelector);
  const theme = useSelector(themeSelector(dispositif?.theme));
  const secondaryThemes = useSelector(secondaryThemesSelector(dispositif?.secondaryThemes));
  const needs = useSelector(dispositifNeedsSelector(dispositif?.needs));

  const [sectionPlaying, setSectionPlaying] = useState<number | null>(null);
  const [isLoadingTts, setIsLoadingTts] = useState(false);
  const isPlayingTts = useMemo(() => sectionPlaying !== null, [sectionPlaying]);
  const text = useMemo(
    () => getAllPageReadableText(dispositif, theme, secondaryThemes, needs),
    [dispositif, theme, secondaryThemes, needs],
  );

  const toggleReading = useCallback(() => {
    if (sectionPlaying === null) {
      setSectionPlaying(0);
      Event("VOICEOVER", "click sidebar button", "Dispo View");
    } else {
      setSectionPlaying(null);
    }
  }, [sectionPlaying]);

  useEffect(() => {
    if (sectionPlaying === null) {
      stopAudio();
    } else {
      if (text[sectionPlaying]) {
        readAudio(
          text[sectionPlaying],
          locale,
          () => setSectionPlaying((i) => (i === null ? null : i + 1)),
          true,
          (val: boolean) => setIsLoadingTts(val)
        );
      } else {
        setSectionPlaying(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionPlaying]);

  return {
    isPlayingTts,
    toggleReading,
    isLoadingTts
  };
}

export default useDispositifTts;
