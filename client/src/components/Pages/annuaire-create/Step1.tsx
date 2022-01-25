import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Input, Spinner } from "reactstrap";
import FInput from "components/FigmaUI/FInput/FInput";
import { UserStructure } from "types/interface";
import PlaceholderLogo from "assets/Placeholder_logo.png";
import FButton from "components/FigmaUI/FButton/FButton";
import API from "utils/API";

const Title = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
  margin-bottom: 16px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 24px;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const LogoWrapper = styled.div`
  width: 200px;
  height: 200px;
`;

const RightLogoContainer = styled.div`
  margin-left: 32px;
  margin-top: 24px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin-top: 16px;
`;
const FileInput = styled(Input)`
z-index: 2;
cursor: pointer;
display: block;
filter: alpha(opacity=0);
height: 100%;
width: 100%;
opacity: 0;
position: absolute;
right: 0;
text-align: right;
top: 0;
background-color: red;
`

interface Props {
  structure: UserStructure | null;
  setStructure: (arg: any) => void;
  setHasModifications: (arg: boolean) => void;
}

export const Step1 = (props: Props) => {
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    props.setStructure({
      ...props.structure,
      hasResponsibleSeenNotification: true,
    });
  }, []);

  const onChange = (e: any) => {
    props.setHasModifications(true);
    return props.setStructure({
      ...props.structure,
      [e.target.id]: e.target.value,
    });
  };
  const handleFileInputChange = (event: any) => {
    setUploading(true);
    const formData = new FormData();
    // @ts-ignore
    formData.append(0, event.target.files[0]);

    API.set_image(formData).then((data_res: any) => {
      const imgData = data_res.data.data;
      props.setStructure({
        ...props.structure,
        picture: {
          secure_url: imgData.secure_url,
          public_id: imgData.public_id,
          imgId: imgData.imgId,
        },
      });
      setUploading(false);
    });
    props.setHasModifications(true);
  };
  const secureUrl =
    props.structure &&
    props.structure.picture &&
    props.structure.picture.secure_url;

  return (
    <MainContainer className="step1">
      <Title>Nom d'affichage</Title>
      <div
        style={{
          marginBottom: "16px",
          width: "440px",
        }}
      >
        <FInput
          id="nom"
          value={props.structure && props.structure.nom}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
        />
      </div>
      <Title>Acronyme</Title>
      <div style={{ marginBottom: "16px", width: "240px" }}>
        <FInput
          id="acronyme"
          value={props.structure && props.structure.acronyme}
          onChange={onChange}
          newSize={true}
          placeholder="L'acronyme de votre structure"
          autoFocus={false}
        />
      </div>
      <Title>Logo</Title>
      <LogoContainer>
        <LogoWrapper>
          {secureUrl ? (
            <img
              src={secureUrl}
              alt={props.structure ? props.structure.acronyme : ""}
              style={{ maxHeight: 200, maxWidth: 200 }}
            />
          ) : (
              <img
                src={PlaceholderLogo}
                style={{ maxHeight: 200, maxWidth: 200 }}
              />
          )}
        </LogoWrapper>
        <RightLogoContainer>
          <FButton
            type="theme"
            name="upload-outline"
            style={{position: "relative"}}
          >
            <FileInput
              className="file-input"
              type="file"
              id="picture"
              name="structure"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            {secureUrl ? (
              <span>Choisir une autre image</span>
            ) : (
              <span>Choisir</span>
            )}

            {uploading && <Spinner color="success" className="ml-10" />}
          </FButton>
          <Text>Formats acceptés : .png / .jpg</Text>
        </RightLogoContainer>
      </LogoContainer>
    </MainContainer>
  );
};