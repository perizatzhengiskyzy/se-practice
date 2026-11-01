import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock,
  DoorClosed,
  Users,
  XCircle,
} from "lucide-react";
import {
  bookings,
  checkAvailability,
  labelToMinutes,
  MAX_BOOKING_MINUTES,
  MINUTES_PER_DAY,
  minutesToLabel,
  rooms,
  type CheckResult,
} from "@/lib/availability";

const pad = (n: number) => String(n).padStart(2, "0");
const toTimeInput = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  return `${pad(h)}:${pad(mm)}`;
};

function RoomChecker() {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const [roomId, setRoomId] = useState(rooms[0].id);
  const [startTime, setStartTime] = useState(toTimeInput(Math.min(currentMinutes + 30, MINUTES_PER_DAY - 1)));
  const [endTime, setEndTime] = useState(toTimeInput(Math.min(currentMinutes + 90, MINUTES_PER_DAY)));
  const [result, setResult] = useState<CheckResult | null>(null);
  const [touched, setTouched] = useState(false);

  const selectedRoom = useMemo(
    () => rooms.find((r) => r.id === roomId) ?? rooms[0],
    [roomId]
  );

  const roomBookings = useMemo(
    () =>
      bookings
        .filter((b) => b.room === roomId)
        .sort((a, b) => a.start - b.start),
    [roomId]
  );

  const handleCheck = () => {
    setTouched(true);
    const interval = {
      start: labelToMinutes(startTime),
      end: labelToMinutes(endTime),
    };
    setResult(checkAvailability(roomId, interval, currentMinutes));
  };

  const handleReset = () => {
    setResult(null);
    setTouched(false);
  };

  const duration = Math.max(0, labelToMinutes(endTime) - labelToMinutes(startTime));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <header className="bg-gradient-to-br from-sky-700 via-sky-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          <div className="flex items-center gap-3">
            <div className="grid place-items-center h-11 w-11 rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
              <CalendarClock className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Smart Campus Room Availability
              </h1>
              <p className="text-sky-100/80 text-sm">
                Check whether a room is free for your proposed slot.
              </p>
            </div>
          </div>
          <div className="mt-5 flex items-center gap-2 text-sm text-sky-100/90">
            <Clock className="h-4 w-4" />
            <span>
              Current time: <strong className="font-semibold">{minutesToLabel(currentMinutes)}</strong> ({now.toLocaleString()})
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 grid gap-6 lg:grid-cols-5">
        <section className="lg:col-span-3 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 sm:p-7">
          <h2 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <DoorClosed className="h-5 w-5 text-sky-700" />
            Request a room
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">Room</span>
              <select
                value={roomId}
                onChange={(e) => {
                  setRoomId(e.target.value);
                  setResult(null);
                }}
                className="mt-1 w-full rounded-lg border-slate-300 border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                {rooms.map((r) => (
                  <option key={r.id} value={r.id} disabled={r.blocked}>
                    {r.name} — {r.building}
                    {r.blocked ? " (blocked)" : ""}
                  </option>
                ))}
              </select>
            </label>

            <div className="rounded-lg bg-slate-50 ring-1 ring-slate-200 p-3 text-sm">
              <div className="flex items-center gap-2 text-slate-600">
                <Building2 className="h-4 w-4" />
                <span>{selectedRoom.building}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 mt-1">
                <Users className="h-4 w-4" />
                <span>Capacity {selectedRoom.capacity}</span>
              </div>
              <div className="mt-1">
                {selectedRoom.blocked ? (
                  <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                    <AlertTriangle className="h-4 w-4" /> Blocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                    <CheckCircle2 className="h-4 w-4" /> Bookable
                  </span>
                )}
              </div>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">Start time</span>
              <input
                type="time"
                value={startTime}
                onChange={(e) => {
                  setStartTime(e.target.value);
                  setResult(null);
                }}
                className="mt-1 w-full rounded-lg border-slate-300 border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">End time</span>
              <input
                type="time"
                value={endTime}
                onChange={(e) => {
                  setEndTime(e.target.value);
                  setResult(null);
                }}
                className="mt-1 w-full rounded-lg border-slate-300 border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </label>
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Duration: {duration} min (max {MAX_BOOKING_MINUTES}). Day range 00:00–24:00 ({MINUTES_PER_DAY} min).
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCheck}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-800 active:bg-sky-900 transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              <CheckCircle2 className="h-4 w-4" /> Check availability
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50 transition focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>

          {result && touched && (
            <div
              role="status"
              className={`mt-5 rounded-xl p-4 ring-1 transition ${
                result.available
                  ? "bg-emerald-50 ring-emerald-200 text-emerald-800"
                  : "bg-rose-50 ring-rose-200 text-rose-800"
              }`}
            >
              <div className="flex items-start gap-3">
                {result.available ? (
                  <CheckCircle2 className="h-5 w-5 mt-0.5 shrink-0 text-emerald-600" />
                ) : (
                  <XCircle className="h-5 w-5 mt-0.5 shrink-0 text-rose-600" />
                )}
                <div>
                  <p className="font-semibold">
                    {result.available ? "Available" : "Unavailable"}
                  </p>
                  <p className="text-sm mt-0.5">{result.message}</p>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="lg:col-span-2 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200 p-5 sm:p-7">
          <h2 className="text-base font-semibold text-slate-900 mb-1">
            {selectedRoom.name}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Existing bookings today (sample data)
          </p>

          {roomBookings.length === 0 ? (
            <p className="text-sm text-slate-500">No existing bookings for this room.</p>
          ) : (
            <ul className="space-y-2">
              {roomBookings.map((b) => (
                <li
                  key={b.id}
                  className="flex items-center justify-between rounded-lg bg-slate-50 ring-1 ring-slate-200 px-3 py-2"
                >
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <Clock className="h-4 w-4 text-slate-400" />
                    <span className="font-medium">
                      {minutesToLabel(b.start)}–{minutesToLabel(b.end)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 truncate ml-2">{b.owner}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-5 text-xs text-slate-500 leading-relaxed">
            Touching endpoints are allowed (a booking ending at 10:00 and one starting at 10:00 do not conflict).
            This checker never modifies the sample data.
          </div>
        </aside>
      </main>

      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 text-xs text-slate-400">
        Smart Campus demo — fictional sample data, no backend.
      </footer>
    </div>
  );
}

export default RoomChecker;
