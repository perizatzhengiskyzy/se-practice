import { useState } from 'react';
import { ROOMS } from './rooms';
import { filterRooms } from './filter';
import { checkRoom } from './booking';
import { toMinutes } from './time';
import FilterPanel from './components/FilterPanel';
import RoomList from './components/RoomList';
import CheckPanel from './components/CheckPanel';

export default function App() {
  const [attendees, setAttendees] = useState(1);
  const [equipment, setEquipment] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState('a101');
  const [now, setNow] = useState('09:00');
  const [start, setStart] = useState('11:00');
  const [end, setEnd] = useState('12:00');
  const [endOfDay, setEndOfDay] = useState(false);
  const [result, setResult] = useState<boolean | null>(null);
  const [error, setError] = useState('');

  const visible = filterRooms(ROOMS, { attendees, equipment }); // F1, F2
  const selected = visible.find(r => r.id === selectedId); // a room that left the list is no longer selected

  function select(id: string) {
    setSelectedId(id);
    setResult(null); // F5: an old result never describes another room
    setError('');
  }

  function toggleEquipment(item: string) {
    setEquipment(cur => (cur.includes(item) ? cur.filter(i => i !== item) : [...cur, item]));
    setResult(null);
  }

  function check() {
    setResult(null);
    if (!selected || !start || !now || (!end && !endOfDay)) {
      setError('Select a room and fill in the current time, the start and the end.');
      return;
    }
    setError('');
    setResult(checkRoom(ROOMS, selected.id, { start: toMinutes(start), end: endOfDay ? 1440 : toMinutes(end), now: toMinutes(now) }));
  }

  return (
    <main className="page">
      <h1>Smart Campus Room Availability</h1>
      <FilterPanel
        attendees={attendees}
        equipment={equipment}
        onAttendees={n => { setAttendees(n); setResult(null); }}
        onToggleEquipment={toggleEquipment}
      />
      <RoomList rooms={visible} selectedId={selected ? selected.id : ''} onSelect={select} />
      {selected && (
        <CheckPanel
          roomName={selected.name}
          now={now} start={start} end={end} endOfDay={endOfDay}
          result={result} error={error}
          onNow={setNow} onStart={v => { setStart(v); setResult(null); }} onEnd={v => { setEnd(v); setResult(null); }}
          onEndOfDay={v => { setEndOfDay(v); setResult(null); }}
          onCheck={check}
        />
      )}
    </main>
  );
}
