/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React from "react";
import styled from "styled-components";
import { SimplifiedStructureForAdmin } from "types/interface";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedStructure: SimplifiedStructureForAdmin | null;
}
export const StructureDetailsModal = (props: Props) => <div>hello</div>;
