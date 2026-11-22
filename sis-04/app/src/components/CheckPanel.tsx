type Props = {
  roomName: string;
  now: string;
  start: string;
  end: string;
  endOfDay: boolean;
  result: boolean | null;
  error: string;
  onNow: (v: string) => void;
  onStart: (v: string) => void;
  onEnd: (v: string) => void;
  onEndOfDay: (v: boolean) => void;
  onCheck: () => void;
};

export default function CheckPanel(p: Props) {
  return (
    <section aria-label="Check availability">
      <h2>2. Check {p.roomName}</h2>
      <div className="row">
        <label>Current time<input type="time" value={p.now} onChange={e => p.onNow(e.target.value)} /></label>
        <label>Start<input type="time" value={p.start} onChange={e => p.onStart(e.target.value)} /></label>
        <label>End<input type="time" value={p.end} disabled={p.endOfDay} onChange={e => p.onEnd(e.target.value)} /></label>
        <label className="inline"><input type="checkbox" checked={p.endOfDay} onChange={e => p.onEndOfDay(e.target.checked)} /> Ends at 24:00</label>
      </div>
      <button onClick={p.onCheck}>Check availability</button>
      {p.error && <p className="error" role="alert">{p.error}</p>}
      {p.result !== null && (
        <p className={`result ${p.result ? 'available' : 'unavailable'}`} role="status">
          {p.result ? 'Available' : 'Unavailable'}
          {!p.result && <span className="why"> — the room is blocked, the time is invalid or in the past, longer than 120 minutes, or overlaps a booking.</span>}
        </p>
      )}
    </section>
  );
}
