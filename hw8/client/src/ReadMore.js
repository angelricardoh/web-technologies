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
    this.myRef = React.createRef();

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
    this.scroll(this.myRef)
    this.setState({
      expanded: !this.state.expanded
    });
    setTimeout(() => {this.scroll(this.myRef)}, 0);
  }

  scroll(ref) {
    // ref.current.scrollIntoView(false);
    ref.current.scrollIntoView({behavior: 'smooth', block: "start", inline: "nearest"})
  }

  render() {
    const { description, lines } = this.props;

    const { expanded, truncated } = this.state;

    return (
      <div ref={this.myRef}>
        <Truncate
          lines={!expanded && lines}
          ellipsis={
            <span>
              ...{" "}
              <br/><br/>
              <MdExpandMore
                            size="32px"
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
  // children: PropTypes.node.isRequired,
  lines: PropTypes.number,
  less: PropTypes.string,
  more: PropTypes.string
};

export default ReadMore;
