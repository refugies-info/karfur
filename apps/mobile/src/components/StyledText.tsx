import { Text, type TextProps } from "react-native";
import styled from "styled-components/native";
import { useTranslationWithRTL } from "~/hooks/useTranslationWithRTL";

interface StyledTextProps extends TextProps {
  color?: string;
  isRTL?: boolean;
  theme?: {
    i18n: {
      isRTL: boolean;
    };
    colors: {
      black: string;
      [key: string]: string | undefined;
    };
  };
}

const StyledText = styled(({ isRTL, ...props }: StyledTextProps) => {
  const { isRTL: isRTLFromHook } = useTranslationWithRTL();
  const rtl = isRTL ?? isRTLFromHook;
  return (
    <Text
      {...props}
      style={[
        {
          textAlign: rtl ? "right" : "left",
        },
        props.style,
      ]}
      selectable
    />
  );
})`
  color: ${({ theme, color }) => color || theme.colors.black};
`;

export const TextDSFR_XL = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.xl}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneBold};
  line-height: 32px;
`;

export const TextDSFR_Chapo_Bold = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.chapo}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneBold};
  line-height: 32px;
`;

export const TextDSFR_L = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.l}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneReg};
  line-height: 28px;
`;
export const TextDSFR_L_Med = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.l}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneMed};
  line-height: 28px;
`;
export const TextDSFR_L_Bold = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.l}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneBold};
  line-height: 28px;
`;

export const TextDSFR_MD = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.md}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneReg};
  line-height: 24px;
`;
export const TextDSFR_MD_Med = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.md}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneMed};
  line-height: 24px;
`;
export const TextDSFR_MD_Bold = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.md}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneBold};
  line-height: 24px;
`;

export const TextDSFR_S = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.s}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneReg};
  line-height: 24px;
`;
export const TextDSFR_S_Med = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.s}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneMed};
  line-height: 24px;
`;
export const TextDSFR_S_Bold = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.s}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneBold};
  line-height: 24px;
`;

export const TextDSFR_XS = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.xs}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneReg};
  line-height: 20px;
`;
export const TextDSFR_XS_Med = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.xs}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneMed};
  line-height: 20px;
`;
export const TextDSFR_XS_Bold = styled(StyledText)`
  font-size: ${({ theme }) => theme.fonts.sizes.xs}px;
  font-family: ${({ theme }) => theme.fonts.families.marianneBold};
  line-height: 20px;
`;
