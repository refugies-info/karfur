import React, { Component } from "react";
import { Button } from "reactstrap";
import { filtres } from "../data";

import TagButton from "../../../components/FigmaUI/TagButton/TagButton";
import Streamline from "../../../assets/streamline";

import "./Tags.scss";
// @ts-ignore
import { Props } from "./Tags.container";
import { Tag } from "../../../@types/interface";
import styled from "styled-components";
import FButton from "../../../components/FigmaUI/FButton/FButton";

const InnerButton = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  line-height: 20px;
`;

export interface PropsBeforeInjection {
  tags: Tag[];
  disableEdit: boolean;
  changeTag: (arg1: number, arg2: Tag) => void;
  addTag: (tags: Tag[]) => void;
  openTag: () => void;
  deleteTag: (idx: number) => void;
  history: any;
  t: any;
  toggleTutorielModal: (arg: string) => void;
}

export class Tags extends Component<Props> {
  state = {
    isDropdownOpen: new Array(
      this.props.tags ? this.props.tags.length : 0
    ).fill(false),
  };

  componentDidMount() {
    if (this.props.tags) {
      this.setState({
        isDropdownOpen: new Array(this.props.tags.length).fill(false),
      });
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.tags && nextProps.tags !== this.props.tags) {
      this.setState({
        isDropdownOpen: new Array(nextProps.tags.length).fill(false),
      });
    }
  }

  toggleDropdown = (key: number, tag: Tag) => {
    if (this.props.disableEdit) {
      this.props.history.push({
        pathname: "/advanced-search",
        search: "?tag=" + tag.short || tag.name || tag,
      });
    } else {
      this.setState({
        isDropdownOpen: this.state.isDropdownOpen.map((x, i) =>
          i === key ? !x : false
        ),
      });
    }
  };

  addTag = () => {
    this.setState({ isDropdownOpen: [...this.state.isDropdownOpen, false] });
    // this.props.addTag(this.props.tags);
  };

  removeTag = (idx: number) => {
    this.setState({
      isDropdownOpen: [...this.state.isDropdownOpen].filter(
        (_, i) => i !== idx
      ),
    });
    this.props.deleteTag(idx);
  };

  render() {
    return (
      <div className="tags" id="tags">
        {(this.props.tags || []).map((tag: Tag, key: number) => {
          if (tag) {
            var tagIcon = filtres.tags.find((elem) => elem.name === tag.name);
            return (
              <div style={{ alignSelf: "flex-end" }}>
                <TagButton
                  key={key}
                  className={"mr-10 color" + (tag.short ? "" : " full")}
                  color={(tag.short || "").replace(/ /g, "-")}
                >
                  <InnerButton>
                    {tagIcon ? (
                      <div
                        style={{
                          display: "flex",
                          marginRight: 10,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <Streamline
                          name={tagIcon.icon}
                          stroke={"white"}
                          width={20}
                          height={20}
                        />
                      </div>
                    ) : null}
                    {tag.short}
                  </InnerButton>
                </TagButton>
              </div>
            );
            // eslint-disable-next-line
          } else {
            return false;
          }
        })}
        {!this.props.disableEdit && (this.props.tags || []).length > 0 ? (
          <Button
            className="plus-button ml-10 icon"
            onClick={this.props.openTag}
          >
            <Streamline name={"tag"} width={22} height={22} />
          </Button>
        ) : !this.props.disableEdit && (this.props.tags || []).length < 1 ? (
          <Button className="plus-button ml-10" onClick={this.props.openTag}>
            <Streamline name={"tag"} width={22} height={22} />
            {"Choisir les thèmes"}
          </Button>
        ) : null}
        {!this.props.disableEdit && (
          <div style={{ marginLeft: "8px", marginTop: "10px" }}>
            <FButton
              type="tuto"
              name={"play-circle-outline"}
              onClick={() => this.props.toggleTutorielModal("Tags")}
            />
          </div>
        )}
      </div>
    );
  }
}
