import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 222px;
  height: 260px;
  background: #fbfbfb;
  border-radius: 12px;
  padding: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
`;

const GreyContainer = styled.div`
  background: #cdcdcd;
  border-radius: 12px;
  width: 100%;
  height: 128px;
  display: flex;
  flex-direct: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
`;

const Text = styled.div`
  color: #fbfbfb;
  font-size: 60px;
`;

const LongLine = styled.div`
  height: 15px;
  background: #cdcdcd;
  border-radius: 4px;
  width: 100%;
`;

const ShortLine = styled.div`
  height: 15px;
  background: #cdcdcd;
  border-radius: 4px;
  width: 125px;
  height: 15px;
  margin-top: 8px;
`;

export const NoActivity = () => (
  <CardContainer>
    <GreyContainer>
      <Text>?</Text>
    </GreyContainer>
    <LongLine />
    <ShortLine />
  </CardContainer>
);
