import { memo } from "react";
import styled from "styled-components/native";
import { Columns, Icon, ReadableText, Spacer } from "~/components";
import { useDateDiffReadable, useTranslationWithRTL } from "~/hooks";

const LastModifDateView = styled.View`
  background-color: #e8edff;
  padding: 6px;
  border-radius: 4px;
`;

const LastModifDateText = styled.Text`
  font-size: 12px;
  font-weight: 700;
  color: #0063cb;
  flex: 1;
  flex-grow: 0;
`;

interface Props {
  lastModificationDate: Date | undefined;
}

const LastModificationDateComponent = (props: Props) => {
  const { t } = useTranslationWithRTL();
  const dateUpdate = props.lastModificationDate ? useDateDiffReadable(new Date(props.lastModificationDate)) : null;

  if (!dateUpdate) return null;
  return (
    <Columns layout="auto">
      <LastModifDateView>
        <LastModifDateText>
          <Icon name="i" color="#0063CB" size={10} />
          <Spacer width={5} />
          <ReadableText>
            {`${t("content_screen.updated_ago", "MISE À JOUR IL Y A").toUpperCase()} ${dateUpdate.toUpperCase()}`}
          </ReadableText>
        </LastModifDateText>
      </LastModifDateView>
    </Columns>
  );
};

export const LastModificationDate = memo(LastModificationDateComponent);
