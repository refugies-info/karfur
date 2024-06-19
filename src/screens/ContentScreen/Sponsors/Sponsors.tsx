import React, { memo } from "react";
import { Image } from "react-native";
import isEmpty from "lodash/isEmpty";
import { ContentStructure, Sponsor } from "@refugies-info/api-types";
import {
  Columns,
  ReadableText,
  Rows,
  SectionTitle,
  Separator,
  Spacer,
  TextDSFR_MD,
} from "../../../components";
import { useTranslationWithRTL } from "../../../hooks";
import { styles } from "../../../theme";
import { SeparatorSpacing } from "../../../components/layout/Separator/Separator";

interface Props {
  sponsors?: (Sponsor | ContentStructure)[];
}

const SponsorsComponent = ({ sponsors }: Props) => {
  const { t } = useTranslationWithRTL();

  if (!sponsors || isEmpty(sponsors)) return null;
  return (
    <>
      <Separator fullWidth spacing={SeparatorSpacing.XLarge} />
      <SectionTitle>
        <ReadableText>
          {t("content_screen.in_partnership_with", "En partenariat avec")}
        </ReadableText>
      </SectionTitle>
      <Spacer height={styles.margin * 2} />
      <Rows>
        {sponsors.map((sponsor, index) => {
          const image = (
            (sponsor as Sponsor).logo || (sponsor as ContentStructure).picture
          )?.secure_url;
          return (
            <Columns
              key={index}
              RTLBehaviour
              layout="auto 1"
              verticalAlign="center"
            >
              {image && (
                <Image
                  style={{ width: 50, height: 50, resizeMode: "contain" }}
                  source={{
                    uri: image,
                  }}
                />
              )}
              <TextDSFR_MD>
                <ReadableText>
                  {(sponsor as Sponsor).name ||
                    (sponsor as ContentStructure).nom}
                </ReadableText>
              </TextDSFR_MD>
            </Columns>
          );
        })}
      </Rows>
    </>
  );
};

export const Sponsors = memo(SponsorsComponent);
