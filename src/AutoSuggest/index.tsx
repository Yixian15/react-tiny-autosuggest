import React from 'react';

import { Option } from './types';

import style from './index.cm.styl';

export interface Props {
  suggestions: Option[];
  onSelect(value: string): void;
  placeholder?: string;
  inputRef?(): void;
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
    this.state= {
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
    this.setState({ value: e.target.value, valueBeforeUpDown: e.target.value });
  }

  handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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

  handleClick(option: string) {
    const { onSelect } = this.props;

    onSelect(option);
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

        {this.state.isCollapsed ? null : (
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

export default AutoSuggest;
