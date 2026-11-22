import type { Room } from '../rooms';
import { fmt } from '../time';

type Props = { rooms: Room[]; selectedId: string; onSelect: (id: string) => void };

export default function RoomList({ rooms, selectedId, onSelect }: Props) {
  if (rooms.length === 0) {
    return <p className="empty" role="status">No rooms match: try fewer attendees or less equipment.</p>; // F4
  }
  return (
    <ul className="rooms">
      {rooms.map(r => (
        <li key={r.id} className={r.id === selectedId ? 'room selected' : 'room'}>
          <button type="button" onClick={() => onSelect(r.id)} aria-pressed={r.id === selectedId}>
            <strong>{r.name}</strong>
            {r.blocked && <span className="tag">Blocked</span>}
            <span className="meta">{r.capacity} seats · {r.equipment.join(', ')}</span>
            <span className="meta">Bookings: {r.bookings.length ? r.bookings.map(b => `${fmt(b.start)}–${fmt(b.end)}`).join(', ') : 'none'}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
