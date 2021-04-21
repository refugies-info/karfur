import React from "react";
import styled from "styled-components";
import FInput from "../../../../components/FigmaUI/FInput/FInput";
import { Progress } from "reactstrap";
import { colorAvancement } from "../../../../components/Functions/ColorFunctions";
import { Event } from "../../../../types/interface";
import { colors } from "../../../../colors";

const ProgressContainer = styled.div`
  width: 100%;
  margin-right: 16px;
`;

const StrenghText = styled.div`
  font-weight: bold;
  font-size: 12px;
  line-height: 15px;
`;

const getStrength = (score: number) => {
  if (score > 0.75) {
    return "Fort";
  } else if (score > 0.25) {
    return "Moyen";
  }
  return "Faible";
};

const ErrorMessageContainer = styled.div`
  color: ${colors.error};
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;

interface Props {
  value: string;
  id: string;
  onChange: (arg: Event) => void;
  passwordVisible: boolean;
  onClick: () => void;
  t: any;
  passwordScore: number;
}

export const PasswordField = (props: Props) => {
  return (
    <>
      <div
        style={{
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div style={{ marginTop: "10px", width: "480px" }}>
          <FInput
            prepend
            append
            prependName="lock-outline"
            appendName={
              props.passwordVisible ? "eye-off-2-outline" : "eye-outline"
            }
            inputClassName="password-input"
            onAppendClick={props.onClick}
            onChange={props.onChange}
            type={props.passwordVisible ? "text" : "password"}
            id={props.id}
            placeholder={props.t(
              "UserProfile.Votre nouveau mot de passe",
              "Votre nouveau mot de passe"
            )}
            autoComplete="new-password"
            newSize
            autoFocus={false}
          />
        </div>
      </div>
      {props.value && (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <ProgressContainer>
              <Progress
                color={colorAvancement(props.passwordScore / 4)}
                value={((0.1 + props.passwordScore / 4) * 100) / 1.1}
              />
            </ProgressContainer>
            <StrenghText>
              {props.t(
                "Register." + getStrength(props.passwordScore / 4),
                getStrength(props.passwordScore / 4)
              )}
            </StrenghText>
          </div>
        </>
      )}
      {props.value && props.passwordScore < 1 && (
        <ErrorMessageContainer>
          <b>
            {props.t(
              "Register.Mot de passe trop faible",
              "Oups, votre mot de passe est trop faible."
            )}
          </b>
        </ErrorMessageContainer>
      )}
    </>
  );
};
