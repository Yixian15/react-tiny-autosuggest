## Install

```
npm i react-tiny-autosuggest
```

## Usage

```
import AutoSuggest from 'react-tiny-autosuggest';

render(){
  const suggestions = ['foo', 'bar'];  
  const handleSelect = selection => {console.log(selection)};

  let input;
  const handleSubmit = () => console.log(input.value);

  return (
    // without submit button
    <AutoSuggest
      suggestions = {suggestions}
      onSelect = {handleSelect}
      placeholder = "whatever..."
    />

    <form onSubmit={handleSubmit}>
      <AutoSuggest
        suggestions = {suggestions}
        onSelect = {()=>{}}
        placeholder = "whatever..."
        inputRef = { node => input = node}
    />
    </form>
  )
}

```

## Examples

[Here're some live demos](http://demo-react-tiny-autosuggest.surge.sh)
