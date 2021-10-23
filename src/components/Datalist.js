import { useDatalist } from './DatalistLogic';

const DatalistItem = ({ setting, list }) => {
  return (
    <datalist id={`${setting}-datalist`}>
      {list.map(option => {
        return <option>{option}</option>
      })}
    </datalist>

  )
}

export default function Datalist({ dataset }) {

  const { datalist } = useDatalist(dataset);

  return (
    <>
      <DatalistItem setting='artist' list={datalist.artist} />
      <DatalistItem setting='song' list={datalist.song} />
      <DatalistItem setting='album' list={datalist.album} />
    </>
  );

}