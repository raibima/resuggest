import React from 'react';

class Autocomplete extends React.Component {
  state = {
    id: this.props.value,
    localValue: getInitialLocalValue(this.props),
    showAutocomplete: false,
  };

  render() {
    let suggestionList;
    if (this.state.showAutocomplete) {
      suggestionList = search(this.state.localValue, this.props.data);
    } else {
      suggestionList = [];
    }

    if (typeof this.props.children === 'function') {
      return this.props.children({
        inputProps: {
          value: this.state.localValue,
          onChange: this.handleChange,
          onFocus: this.handleFocus,
          onBlur: this.handleBlur,
        },
        suggestionList,
        selectItem: this.selectItem,
      });
    }

    return (
      <React.Fragment>
        <input
          value={this.state.localValue}
          onChange={this.handleChange}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
        />
        <ul>
          {suggestionList.map((s) => (
            <li onClick={this.selectItem(s)} key={s.value}>
              {s.label}
            </li>
          ))}
        </ul>
      </React.Fragment>
    );
  }

  handleChange = (e) => {
    this.setState({
      localValue: e.target.value,
    });
  };

  selectItem = (item) => (e) => {
    // cancel scheduled blur event (if any)
    this.clearTimeout();

    if (this.props.value !== item.value) {
      // commit change to parent
      this.props.onChange(item.value);
    } else {
      // if next value is the same as current value
      // then no need to commit change. Just update
      // the local value.
      this.setState({
        localValue: getInitialLocalValue(this.props),
      });
    }
  };

  handleBlur = () => {
    // When a suggestion item is chosen via a click,
    // it will trigger a blur event beforehand. Since this blur handler,
    // also triggers an update / reset, the click handler itself will
    // not bet triggered!
    //
    // To fix this, we can instead schedule the blur callback
    // in some short milliseconds (in this case, 100ms).
    //
    // IF within that timespan we detect a click, then we should
    // cancel the scheduled blur callback, and run the click
    // callback instead.
    this.timeoutID = setTimeout(() => {
      const result = search(this.state.localValue, this.props.data);
      if (result.length > 0 && result[0].value !== this.props.value) {
        this.props.onChange(result[0].value);
      } else {
        this.setState({
          localValue: getInitialLocalValue(this.props),
        });
      }
    }, 100);
  };

  handleFocus = () => {
    // only show autocomplete when user focuses on the input
    this.setState({
      showAutocomplete: true,
    });
  };

  componentWillUnmount() {
    this.clearTimeout();
  }

  clearTimeout() {
    if (this.timeoutID) {
      clearTimeout(this.timeoutID);
    }
  }

  // For encapsulation, gDSFP makes sense. Rather
  // than instructing users to provide a unique `key` prop,
  // using gDSFP here will simplify the overall component API,
  // thus improves usability.
  static getDerivedStateFromProps(props, state) {
    const prevId = state.id;
    const nextId = props.value;
    if (nextId !== prevId) {
      // props change --> reset state
      return {
        id: nextId,
        localValue: getInitialLocalValue(props),
        showAutocomplete: false,
      };
    }
    // proceed state changes
    return null;
  }
}

export default Autocomplete;

/////////////
// HELPERS //
/////////////

function search(keyword, data) {
  return data.filter((d) => {
    const regex = new RegExp(keyword, 'i');
    return regex.test(d.label) || regex.test(String(d.value));
  });
}

function getInitialLocalValue({ defaultValue, value, data }) {
  const targetValue = value || defaultValue;
  if (targetValue) {
    const target = data.find((d) => d.value === targetValue);
    if (target) {
      return target.label;
    }
  }
  return '';
}
