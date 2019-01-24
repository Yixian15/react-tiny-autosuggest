import React from 'react';
import ReactDOM from 'react-dom';

import AutoSuggest from './autosuggest';

const suggestions = ['C', 'C++', 'Python', 'Java', 'Javascript', 'PHP'];
const handleSelect = selection => alert(`You selected ${selection}`);

ReactDOM.render(<AutoSuggest suggestions={suggestions} onSelect={handleSelect}/>, document.getElementById('app'));
