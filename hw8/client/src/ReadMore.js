import React, { Component } from "react";
import PropTypes from "prop-types";
import Truncate from "react-truncate";
import { MdExpandMore, MdExpandLess } from 'react-icons/md'

class ReadMore extends Component {
  constructor(...args) {
    super(...args);

    this.state = {
      expanded: false,
      truncated: false
    };

    this.handleTruncate = this.handleTruncate.bind(this);
    this.toggleLines = this.toggleLines.bind(this);
  }

  handleTruncate(truncated) {
    if (this.state.truncated !== truncated) {
      this.setState({
        truncated
      });
    }
  }

  toggleLines(event) {
    event.preventDefault();

    this.setState({
      expanded: !this.state.expanded
    });
  }

  render() {
    const { description, lines } = this.props;

    const { expanded, truncated } = this.state;

    return (
      <div>
        <Truncate
          lines={!expanded && lines}
          ellipsis={
            <span>
              ...{" "}
              <br/><br/>
              <MdExpandMore size="32px"
                            style={{ float:'right'}}
                            href="#"
                            onClick={this.toggleLines}/>
            </span>
          }
          onTruncate={this.handleTruncate}
        >
          {description}
        </Truncate>
        {!truncated && expanded && (
          <span>
            {" "}
            <br/><br/>
            <MdExpandLess size="32px"
                          style={{ float:'right'}}
                          href="#"
                          onClick={this.toggleLines}/>
          </span>
        )}
      </div>
    );
  }
}

ReadMore.defaultProps = {
  lines: 6,
  more: "Read more",
  less: "Show less"
};

ReadMore.propTypes = {
  children: PropTypes.node.isRequired,
  lines: PropTypes.number,
  less: PropTypes.string,
  more: PropTypes.string
};

export default ReadMore;
