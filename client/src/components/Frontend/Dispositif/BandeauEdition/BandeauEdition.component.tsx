import React from "react";
import { Props } from "./BandeauEdition.container";
import { BandeauEditionWithoutVariante } from "./BandeauEditionWithoutVariante";

declare const window: any;

export interface PropsBeforeInjection {
  typeContenu: "dispositif" | "demarche";
  toggleTutoriel: () => void;
  displayTuto: boolean;
  toggleDispositifValidateModal: () => void;
  toggleDraftModal: () => void;
  tKeyValue: number;
  toggleDispositifCreateModal: () => void;
  isModified: boolean;
  isSaved: boolean;
}
export class BandeauEdition extends React.Component<
  Props,
  { scroll: boolean; visible: boolean }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      visible: true,
      scroll: false,
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    const visible = currentScrollPos < 70;
    this.setState({ visible });
  };

  render() {
    const props = this.props;

    return (
      <BandeauEditionWithoutVariante
        visible={this.state.visible}
        typeContenu={props.typeContenu}
        toggleTutoriel={props.toggleTutoriel}
        isModified={props.isModified}
        isSaved={props.isSaved}
        displayTuto={props.displayTuto}
        toggleDispositifValidateModal={props.toggleDispositifValidateModal}
        toggleDraftModal={props.toggleDraftModal}
        tKeyValue={props.tKeyValue}
        toggleDispositifCreateModal={props.toggleDispositifCreateModal}
      />
    );
  }
}
