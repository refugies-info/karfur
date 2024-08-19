import * as React from "react";

export class MockReactModal extends React.Component {
  render() {
    return (
      <div id={this.props.id}>{this.props.isOpen && this.props.children}</div>
    );
  }
}
