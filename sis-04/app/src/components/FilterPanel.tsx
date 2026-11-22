import { EQUIPMENT } from '../rooms';

type Props = {
  attendees: number;
  equipment: string[];
  onAttendees: (n: number) => void;
  onToggleEquipment: (item: string) => void;
};

export default function FilterPanel({ attendees, equipment, onAttendees, onToggleEquipment }: Props) {
  return (
    <section aria-label="Filter rooms">
      <h2>1. Find rooms</h2>
      <div className="row">
        <label>Attendees
          <input type="number" min={1} value={attendees} onChange={e => onAttendees(Math.max(1, Number(e.target.value) || 1))} />
        </label>
        {EQUIPMENT.map(item => (
          <label key={item} className="inline">
            <input type="checkbox" checked={equipment.includes(item)} onChange={() => onToggleEquipment(item)} /> {item}
          </label>
        ))}
      </div>
    </section>
  );
}
