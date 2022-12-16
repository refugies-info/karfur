import React from "react";
import { Container } from "reactstrap";
import { useTranslation } from "next-i18next";
import { cls } from "lib/classname";
import { useWindowSize } from "hooks";
import { Accordion } from "components/Pages/staticPages/common";
import commonStyles from "scss/components/staticPages.module.scss";

interface Props {
  nbDemarches: number;
}

const WhyAccordions = (props: Props) => {
  const { t } = useTranslation();
  const { isTablet } = useWindowSize();

  return (
    <div className={cls(commonStyles.section)}>
      <Container className={commonStyles.container}>
        <h2 className={commonStyles.title2}>{t("Homepage.whyTitle")}</h2>
        <Accordion
          items={[
            {
              title: t("Homepage.whyAccordionTitle1"),
              text: t("Homepage.whyAccordionText1", { count: props.nbDemarches }),
              video: "/video/home-video-1.mp4",
              mediaWidth: 450,
              mediaHeight: 320
            },
            {
              title: t("Homepage.whyAccordionTitle2"),
              text: t("Homepage.whyAccordionText2"),
              video: "/video/home-video-2.mp4",
              mediaWidth: 450,
              mediaHeight: 320
            },
            {
              title: t("Homepage.whyAccordionTitle3"),
              text: t("Homepage.whyAccordionText3"),
              video: "/video/home-video-3.mp4",
              mediaWidth: 450,
              mediaHeight: 320
            },
            {
              title: t("Homepage.whyAccordionTitle4"),
              text: t("Homepage.whyAccordionText4"),
              youtube: "https://www.youtube-nocookie.com/embed/QMRR2csgan0",
              mediaWidth: 450,
              mediaHeight: 320
            }
          ]}
          withImages
          initOpen
          multiOpen={!!isTablet}
        />
      </Container>
    </div>
  );
};

export default WhyAccordions;
