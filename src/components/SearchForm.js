import React from 'react';
import { searchFilter } from '../logic/chart';

export default class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  handleChange = (event) => {
    this.setState(() => ({
      value: event.target.value,
    }));
  }

  handleSubmit = (event) => {
    event.preventDefault();

    const { setting, setFilteredDataset, data } = this.props;
    const filteredDataset = searchFilter(setting, this.state.value, data);
    setFilteredDataset(filteredDataset, 'search');
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          type="text"
          id="filter-input"
          list={this.props.datalist}
          placeholder="Search for..."
          onChange={this.handleChange}
          value={this.state.value}
        />
        <input type="submit" className="button" id="submit-button" value="Search" />
      </form >
    );
  }
}