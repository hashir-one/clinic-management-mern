// Converts "HH:MM" 24h to minutes from midnight
const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

// Converts minutes from midnight to "HH:MM AM/PM"
const minutesToDisplayTime = (minutes) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayHours = h % 12 === 0 ? 12 : h % 12;
  const displayMinutes = m < 10 ? `0${m}` : m;
  return `${displayHours}:${displayMinutes} ${period}`;
};

/**
 * Generate all possible time slots for a shift window
 */
const generateShiftSlots = (startStr, endStr, durationMinutes) => {
  const slots = [];
  let current = timeToMinutes(startStr);
  const end = timeToMinutes(endStr);

  while (current + durationMinutes <= end) {
    slots.push(minutesToDisplayTime(current));
    current += durationMinutes;
  }

  return slots;
};

/**
 * Compute available slots for a doctor on a given day, excluding booked slots
 */
const getAvailableSlots = (doctor, bookedSlots = []) => {
  const allSlots = [];
  const duration = doctor.slotDurationMinutes || 20;

  if (doctor.shifts?.morning?.enabled && doctor.shifts.morning.start && doctor.shifts.morning.end) {
    allSlots.push(...generateShiftSlots(doctor.shifts.morning.start, doctor.shifts.morning.end, duration));
  }

  if (doctor.shifts?.evening?.enabled && doctor.shifts.evening.start && doctor.shifts.evening.end) {
    allSlots.push(...generateShiftSlots(doctor.shifts.evening.start, doctor.shifts.evening.end, duration));
  }

  // Filter out slots that are already booked
  return allSlots.map((slot) => ({
    time: slot,
    isAvailable: !bookedSlots.includes(slot),
  }));
};

module.exports = {
  getAvailableSlots,
};
