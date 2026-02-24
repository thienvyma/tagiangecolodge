"use client";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";

type BookedRange = { checkin: string; checkout: string };

interface Props {
  bookedRanges: BookedRange[];
  checkin: string;
  checkout: string;
  onSelect: (checkin: string, checkout: string) => void;
}

const DAYS_VI = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const MONTHS_VI = ["Tháng 1","Tháng 2","Tháng 3","Tháng 4","Tháng 5","Tháng 6","Tháng 7","Tháng 8","Tháng 9","Tháng 10","Tháng 11","Tháng 12"];
const INITIAL_MONTHS = 4;
const LOAD_MORE = 3;

function toStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function isBooked(dateStr: string, ranges: BookedRange[]): boolean {
  return ranges.some((r) => dateStr >= r.checkin && dateStr < r.checkout);
}
function inRange(dateStr: string, ci: string, co: string): boolean {
  return ci && co ? dateStr >= ci && dateStr < co : false;
}

export default function BookingCalendar({ bookedRanges, checkin, checkout, onSelect }: Props) {
  const now = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => toStr(now), [now]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selecting, setSelecting] = useState<"checkin"|"checkout">(checkin ? "checkout" : "checkin");
  const [monthCount, setMonthCount] = useState(INITIAL_MONTHS);

  const months = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < monthCount; i++) arr.push(new Date(now.getFullYear(), now.getMonth() + i, 1));
    return arr;
  }, [now, monthCount]);

  // Infinite scroll — load more months when near bottom
  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      setMonthCount((c) => c + LOAD_MORE);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleDayClick = (dateStr: string) => {
    if (dateStr < todayStr || isBooked(dateStr, bookedRanges)) return;

    if (selecting === "checkin" || dateStr <= checkin) {
      onSelect(dateStr, "");
      setSelecting("checkout");
    } else {
      // Check if range crosses booked period
      if (bookedRanges.some((r) => checkin < r.checkout && dateStr > r.checkin)) {
        onSelect(dateStr, "");
        setSelecting("checkout");
      } else {
        onSelect(checkin, dateStr);
        setSelecting("checkin");
      }
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-xs text-stone-500 font-medium text-center">
        {selecting === "checkin" ? "👆 Chọn ngày nhận phòng" : "👆 Chọn ngày trả phòng"}
      </p>

      <div ref={scrollRef} className="max-h-[400px] overflow-y-auto scroll-smooth space-y-4 pr-1" style={{ scrollbarWidth: "thin" }}>
        {months.map((month) => (
          <MonthGrid key={`${month.getFullYear()}-${month.getMonth()}`}
            month={month} todayStr={todayStr} bookedRanges={bookedRanges}
            checkin={checkin} checkout={checkout} onDayClick={handleDayClick} />
        ))}
        <p className="text-center text-xs text-stone-300 py-2">Cuộn xuống để xem thêm tháng...</p>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500 pt-1">
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 border border-red-200" /> Đã đặt</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-forest-500" /> Đã chọn</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-forest-50 border border-forest-200" /> Khoảng ở</span>
      </div>
    </div>
  );
}

function MonthGrid({ month, todayStr, bookedRanges, checkin, checkout, onDayClick }: {
  month: Date; todayStr: string; bookedRanges: BookedRange[];
  checkin: string; checkout: string; onDayClick: (d: string) => void;
}) {
  const days = useMemo(() => {
    const y = month.getFullYear(), m = month.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const total = new Date(y, m + 1, 0).getDate();
    const cells: (string | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= total; d++) cells.push(toStr(new Date(y, m, d)));
    return cells;
  }, [month]);

  return (
    <div>
      <p className="text-sm font-semibold text-stone-700 text-center mb-2 sticky top-0 bg-white/90 backdrop-blur-sm py-1.5 z-10 rounded">
        {MONTHS_VI[month.getMonth()]} {month.getFullYear()}
      </p>
      <div className="grid grid-cols-7 gap-0.5">
        {DAYS_VI.map((d) => (
          <div key={d} className="text-center text-[10px] font-medium text-stone-400 py-1">{d}</div>
        ))}
        {days.map((dateStr, i) => {
          if (!dateStr) return <div key={`e${i}`} />;
          const isPast = dateStr < todayStr;
          const booked = isBooked(dateStr, bookedRanges);
          const isCI = dateStr === checkin;
          const isCO = dateStr === checkout;
          const inR = inRange(dateStr, checkin, checkout);
          const dayNum = parseInt(dateStr.split("-")[2]);

          let cls = "w-full aspect-square flex items-center justify-center text-xs rounded-md transition-all ";
          if (isPast) cls += "text-stone-300 cursor-default";
          else if (booked) cls += "bg-red-50 text-red-300 cursor-not-allowed line-through border border-red-100";
          else if (isCI || isCO) cls += "bg-forest-600 text-white font-bold shadow-sm cursor-pointer";
          else if (inR) cls += "bg-forest-50 text-forest-700 border border-forest-100 cursor-pointer hover:bg-forest-100";
          else cls += "text-stone-700 hover:bg-stone-100 cursor-pointer";

          return (
            <button key={dateStr} type="button" disabled={isPast || booked}
              onClick={() => onDayClick(dateStr)} className={cls}
              title={booked ? "Đã có khách đặt" : isCI ? "Nhận phòng" : isCO ? "Trả phòng" : ""}>
              {dayNum}
            </button>
          );
        })}
      </div>
    </div>
  );
}
