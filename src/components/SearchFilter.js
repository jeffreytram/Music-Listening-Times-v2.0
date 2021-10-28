import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

import SearchForm from './SearchForm';


const SearchFilter = ({ setSearchType, datalistSetting, setFilteredDataset, dataset }) => {
  return (
    <div id="search-filter">
      <label htmlFor="general-filter">
        <span><FontAwesomeIcon icon={faSearch} /> Search by </span>
        <select id="filter-select" onChange={(event) => setSearchType(event.target.value)} value={datalistSetting}>
          <option value="artist">Artist</option>
          <option value="song">Song</option>
          <option value="album">Album</option>
        </select>
      </label>
      <br />
      <SearchForm
        setting={datalistSetting}
        setFilteredDataset={setFilteredDataset}
        data={dataset}
        datalist={`${datalistSetting}-datalist`}
      />
    </div >
  )
}

export default SearchFilter;