import React from 'react';
import classnames from 'classnames';

import { Option } from './types';

import styles from './index.cm.styl';

export interface Props {
  value: string; // controlled componnents
  suggestions: Option[];
  onUserInput?(value: string): void;
  onSelect?(option: Option): void;
  placeholder?: string;
}

interface AutoSuggestState {
  value: string,
  valueBeforeUpDown: string;
  highlightedIndex?: number;
  isCollapsed: boolean
}

class AutoSuggest extends React.Component<Props, AutoSuggestState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      value: '',
      valueBeforeUpDown: '',
      highlightedIndex: undefined,
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

  handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;

    this.props.onUserInput && this.props.onUserInput(value);
    this.setState({ value, valueBeforeUpDown: value });
  }

  handleSubmit() {
    this.props.onSelect && this.props.onSelect(this.state.value);
    this.clearSuggestions();
  }

  getSuggestions() {
    if (!this.state.value) {
      return [];
    }

    const value = this.state.valueBeforeUpDown;
    const { suggestions } = this.props;

    return suggestions.map((suggestion) => typeof suggestion === 'string' ? suggestion : suggestion.value).filter((suggestion) => suggestion.startsWith(value));
  }

  updateHighlightedIndex(direction: 1 | -1) {
    const suggestions = this.getSuggestions();
    if (suggestions.length === 0) {
      return;
    }

    if (this.state.highlightedIndex === undefined) {
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
          highlightedIndex: undefined,
          value: this.state.valueBeforeUpDown
        });
      }
    }
  }

  handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault()
        this.updateHighlightedIndex(-1);
        break;
      case 'ArrowDown':
        this.updateHighlightedIndex(1);
        break;
      case 'Enter':
        this.handleSubmit();
      default:
        return;
    }
  }

  handleClick(option: string) {
    const { onSelect } = this.props;

    onSelect && onSelect(option);
    this.clearSuggestions();
  }

  clearSuggestions() {
    this.setState({ value: '', valueBeforeUpDown: '', highlightedIndex: undefined });
  }

  collapseSuggestions() {
    this.setState({
      isCollapsed: true,
      highlightedIndex: undefined
    });
  }

  render() {
    const { placeholder } = this.props;
    const { value, highlightedIndex } = this.state;

    const suggestions = this.getSuggestions();

    return (
      <div className={styles.autoSuggest}>
        <input
          value={value}
          placeholder={placeholder}
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
          onFocus={() => this.setState({ isCollapsed: false })}
          onBlur={this.collapseSuggestions}
        />

        {this.state.isCollapsed ? null : (
          <div className={styles.suggestions}>
            {suggestions.map((option, index) => {
              const isHighlighted = index === highlightedIndex;

              return (
                <div
                  key={option}
                  className={classnames(styles.option, { [styles.highlighted]: isHighlighted })}
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

export default AutoSuggest;
