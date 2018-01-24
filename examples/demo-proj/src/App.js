import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import AutoSuggest from 'react-tiny-autosuggest';

class App extends Component {
  render() {
    const suggestions = ['C', 'C++', 'Python', 'Java', 'Javascript', 'PHP'];
    const handleSelect = selection => alert(`You selected ${selection}`);

    let input;
    const handleSubmit = () => alert(`You selected ${input.value}`);

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>


        <h1>Demo of react-tiny-autosuggest</h1>
        <h2>Without submit button</h2>

        <div style={{ width: '400px', margin: '20px auto' }}>
          <AutoSuggest
            suggestions={suggestions}
            onSelect={handleSelect}
            placeholder="Choose a programming language..."
          />
        </div>

        <h2>With submit button </h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ float: 'left', width: '400px' }}>
            <AutoSuggest
              suggestions={suggestions}
              onSelect={() => {}}
              placeholder="Choose a programming language..."
              inputRef={node => (input = node)}
            />
          </div>

          <button type="submit" style={{ float: 'left', height: '34px' }}>
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default App;
