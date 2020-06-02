import React, { Component } from "react";
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { withTranslation } from "react-i18next";

import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";

import "./Tags.scss";
import variables from "scss/colors.scss";

class Tags extends Component {
  state = {
    isDropdownOpen: new Array(this.props.tags.length).fill(false),
  };

  componentDidMount() {
    if (this.props.tags) {
      this.setState({
        isDropdownOpen: new Array(this.props.tags.length).fill(false),
      });
    }
  }

  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps) {
    if (nextProps.tags && nextProps.tags !== this.props.tags) {
      this.setState({
        isDropdownOpen: new Array(nextProps.tags.length).fill(false),
      });
    }
  }

  toggleDropdown = (e, key, tag) => {
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
    this.props.addTag();
  };

  removeTag = (idx) => {
    this.setState({
      isDropdownOpen: [...this.state.isDropdownOpen].filter(
        (_, i) => i !== idx
      ),
    });
    this.props.deleteTag(idx);
  };

  render() {
    const { t } = this.props;
    return (
      <div className="tags" id="tags">
        {(this.props.tags || []).map((tag, key) => {
          if (tag) {
            return (
              <ButtonDropdown
                isOpen={
                  !this.props.disableEdit && this.state.isDropdownOpen[key]
                }
                toggle={(e) => this.toggleDropdown(e, key, tag)}
                className="tags-dropdown"
                key={key}
              >
                <DropdownToggle caret={!this.props.disableEdit}>
                  {tag &&
                    t(
                      "Tags." + (tag.short || tag.name || tag),
                      tag.short || tag.name || tag
                    )}
                </DropdownToggle>
                <DropdownMenu>
                  {this.props.filtres.map((e, i) => {
                    return (
                      <DropdownItem
                        className="dropdown-custom"
                        onMouseOver={(ev) =>
                          (ev.target.style.backgroundColor = e.darkColor)
                        }
                        onMouseOut={(ev) =>
                          (ev.target.style.backgroundColor = "#FFFFFF")
                        }
                        onClick={() => this.props.changeTag(key, e)}
                        key={i}
                        id={i}
                      >
                        {e && t("Tags." + e.short || e.name, e.short || e.name)}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
                {!this.props.disableEdit && (
                  <div className="tags-icons">
                    <div onClick={() => this.removeTag(key)}>
                      <EVAIcon
                        name="close-circle"
                        fill={variables.error}
                        className="delete-icon"
                        size="xlarge"
                      />
                    </div>
                  </div>
                )}
              </ButtonDropdown>
            );
          }
          return false;
        })}
        {!this.props.disableEdit && (this.props.tags || []).length < 3 && (
          <Button className="plus-button ml-10" onClick={this.addTag}>
            <EVAIcon
              className="mr-10"
              name="plus-circle-outline"
              fill="#CDCDCD"
            />
            {t("Dispositif.Ajouter un thème", "Ajouter un thème")}
          </Button>
        )}
      </div>
    );
  }
}

export default withTranslation()(Tags);
