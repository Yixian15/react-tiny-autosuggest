import React, { Component } from 'react';
import PropTypes from 'prop-types';

import style from './AutoSuggest.cm.styl';

console.log('style', style)

class AutoSuggest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
      valueBeforeUpDown: '',
      highlightedIndex: null,
      isCollapsed: true
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSuggestions = this.getSuggestions.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.updateHighlightedIndex = this.updateHighlightedIndex.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.clearSuggestions = this.clearSuggestions.bind(this);
    this.collapseSuggestions = this.collapseSuggestions.bind(this);
  }

  handleChange(e) {
    this.setState({ value: e.target.value, valueBeforeUpDown: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();

    const { onSelect } = this.props;
    onSelect(this.state.value);

    this.clearSuggestions();
  }

  getSuggestions() {
    if (!this.state.value) {
      return [];
    }

    const value = this.state.valueBeforeUpDown.toUpperCase();
    const { suggestions } = this.props;

    return suggestions.filter(suggestion => {
      return suggestion.toUpperCase().startsWith(value);
    });
  }

  updateHighlightedIndex(direction) {
    const suggestions = this.getSuggestions();
    if (suggestions.length === 0) {
      return;
    }

    if (this.state.highlightedIndex === null) {
      // no suggestion selected
      if (direction === 1) {
        // select last suggestion
        this.setState({ highlightedIndex: 0, value: suggestions[0] });
      } else if (direction === -1) {
        // select first suggestion
        this.setState({
          highlightedIndex: suggestions.length - 1,
          value: suggestions[suggestions.length - 1]
        });
      }
    } else {
      const nextIndex = this.state.highlightedIndex + direction;
      if (nextIndex >= 0 && nextIndex < suggestions.length) {
        // inside suggestions index range
        this.setState({
          highlightedIndex: nextIndex,
          value: suggestions[nextIndex]
        });
      } else {
        this.setState({
          highlightedIndex: null,
          value: this.state.valueBeforeUpDown
        });
      }
    }
  }

  handleKeyDown(e) {
    switch (e.keyCode) {
      case 38:
        this.updateHighlightedIndex(-1);
        break;
      case 40:
        this.updateHighlightedIndex(1);
        break;
      default:
        return;
    }
  }

  handleClick(option) {
    const { onSelect } = this.props;

    onSelect(option);
    this.clearSuggestions();
  }

  clearSuggestions() {
    this.setState({ value: '', valueBeforeUpDown: '', highlightedIndex: null });
  }

  collapseSuggestions() {
    this.setState({
      isCollapsed: true,
      highlightedIndex: null
    });
  }

  render() {
    const suggestions = this.getSuggestions();
    const placeholder = this.props.placeholder || '';
    const { value } = this.state;
    const inputRef = this.props.inputRef || null;

    return (
      <div className={style.autoSuggest}>
        <form onSubmit={this.handleSubmit}>
          <input
            value={value}
            placeholder={placeholder}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            onFocus={() => this.setState({ isCollapsed: false })}
            onBlur={this.collapseSuggestions}
            ref={inputRef}
          />
        </form>

        {this.state.isCollapsed  ? null : (
          <div className={style.suggestions}>
            {suggestions.map((option, index) => {
              return (
                <div
                  key={option}
                  className={style.option}
                  onClick={() => {
                    this.handleClick(option);
                  }}
                  onMouseDown={() => this.handleClick(option)}
                  onMouseOver={() => this.setState({ highlightedIndex: index })}
                >
                  {option}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

AutoSuggest.propTypes = {
  suggestions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onSelect: PropTypes.func,
  placeholder: PropTypes.string,
  inputRef: PropTypes.func
}

export default AutoSuggest;
