import React, { useState } from "react";
import moment from "moment";
import styled from "styled-components";
import TimePicker from "rc-time-picker";
import { CustomCheckBox } from "./CustomCheckBox";
import {
  OpeningHours,
  DetailedOpeningHours,
} from "types/interface";

interface Props {
  day: string;
  onClick: (day: string) => void;
  openingHours: OpeningHours;
  onChange: (arg1: any, arg2: string, arg3: string) => void;
}

const MainContainer = styled.div`
  background: ${(props) => (props.isDayChecked ? "#DEF7C2" : "#f2f2f2")};
  border-radius: 12px;
  padding: 12px;
  margin-top: 4px;
  margin-bottom: 4px;
  width: fit-content;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  cursor: pointer;
`;
const Text = styled.div`
  color: #828282;
  margin-left: 8px;
  margin-right: 8px;
`;
export const HoursDetails = (props: Props) => {
  const getInitialPuisDeValue = (correspondingDay: DetailedOpeningHours[]) => {
    if (correspondingDay.length === 0) return false;
    if (correspondingDay[0].from1 || correspondingDay[0].to1) return true;
    return false;
  };
  const correspondingDay =
    props.openingHours && props.openingHours.details
      ? props.openingHours.details.filter(
          (element) => element.day === props.day
        )
      : [];
  const [isPuisDeChecked, setIsPuisDeCheck] = useState(
    getInitialPuisDeValue(correspondingDay)
  );
  const isDayChecked = correspondingDay.length > 0;

  const getInitialValue = (
    isDayChecked: boolean,
    correspondingDay: DetailedOpeningHours[],
    index: "from0" | "to0" | "from1" | "to1"
  ) => {
    const defaultValue = moment("00:00", "HH:mm");
    if (!isDayChecked || !correspondingDay[0][index]) return defaultValue;

    return moment(correspondingDay[0][index], "HH.mm");
  };

  const toggleIsPuisDe = () => {
    if (!isDayChecked) return;
    setIsPuisDeCheck((prevState) => !prevState);
  };

  return (
    <MainContainer isDayChecked={isDayChecked}>
      <CustomCheckBox
        checked={isDayChecked}
        onClick={() => props.onClick(props.day)}
      />
      {`${props.day} `}
      <Text>de</Text>
      <TimePicker
        // @ts-ignore
        style={{ width: 100 }}
        showSecond={false}
        defaultValue={getInitialValue(isDayChecked, correspondingDay, "from0")}
        className="xxx"
        disabled={!isDayChecked}
        onChange={(value) => props.onChange(value, "from0", props.day)}
      />
      <Text>à</Text>
      <TimePicker
        // @ts-ignore
        style={{ width: 100 }}
        showSecond={false}
        defaultValue={getInitialValue(isDayChecked, correspondingDay, "to0")}
        className="xxx"
        disabled={!isDayChecked}
        onChange={(value) => props.onChange(value, "to0", props.day)}
      />
      <div style={{ marginLeft: "16px" }}>
        <CustomCheckBox checked={isPuisDeChecked} onClick={toggleIsPuisDe} />
      </div>
      <div style={{ marginRight: "4px" }}>puis de</div>
      {isPuisDeChecked && (
        <>
          <TimePicker
            // @ts-ignore
            style={{ width: 100 }}
            showSecond={false}
            defaultValue={getInitialValue(
              isDayChecked,
              correspondingDay,
              "from1"
            )}
            className="xxx"
            disabled={!isDayChecked}
            onChange={(value) => props.onChange(value, "from1", props.day)}
          />
          <Text>à</Text>
          <TimePicker
            // @ts-ignore
            style={{ width: 100 }}
            showSecond={false}
            defaultValue={getInitialValue(
              isDayChecked,
              correspondingDay,
              "to1"
            )}
            className="xxx"
            disabled={!isDayChecked}
            onChange={(value) => props.onChange(value, "to1", props.day)}
          />
        </>
      )}
    </MainContainer>
  );
};
