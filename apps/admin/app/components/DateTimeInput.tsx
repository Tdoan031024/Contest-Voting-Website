'use client';

import React, { useState, useEffect, useRef } from 'react';

interface DateTimeInputProps {
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
  disabled?: boolean;
}

function parseISO(iso: string): { date: string; time: string } {
  if (!iso) return { date: '', time: '' };
  const [datePart = '', timePart = ''] = iso.split('T');
  const [y = '', m = '', d = ''] = datePart.split('-');
  return {
    date: d && m && y ? `${d.padStart(2,'0')}/${m.padStart(2,'0')}/${y}` : '',
    time: timePart.slice(0, 5),
  };
}

function toISO(date: string, time: string): string {
  const parts = date.split('/');
  const dd = parts[0] || '';
  const mm = parts[1] || '';
  const yyyy = parts[2] || '';
  if (!dd || !mm || !yyyy || yyyy.length < 4) return '';
  return `${yyyy}-${mm.padStart(2,'0')}-${dd.padStart(2,'0')}T${time || '00:00'}`;
}

function isValidDate(date: string): boolean {
  const parts = date.split('/').map(Number);
  const [dd, mm, yyyy] = parts;
  if (!dd || !mm || !yyyy || yyyy < 1970) return false;
  const dt = new Date(yyyy, mm - 1, dd);
  return dt.getFullYear() === yyyy && dt.getMonth() === mm - 1 && dt.getDate() === dd;
}

export default function DateTimeInput({ value = '', onChange, className = '', disabled }: DateTimeInputProps) {
  const [dateVal, setDateVal] = useState('');
  const [timeVal, setTimeVal] = useState('');
  const [dateError, setDateError] = useState(false);
  const skipEmit = useRef(true);

  useEffect(() => {
    skipEmit.current = true;
    const { date, time } = parseISO(value);
    setDateVal(date);
    setTimeVal(time);
  }, [value]);

  const emit = (date: string, time: string) => {
    if (skipEmit.current) { skipEmit.current = false; return; }
    const iso = toISO(date, time);
    if (iso && onChange) onChange(iso);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^\d/]/g, '');
    if (raw.length === 2 && !dateVal.endsWith('/') && !raw.includes('/')) raw += '/';
    if (raw.length === 5 && (raw.match(/\//g) || []).length < 2) raw += '/';
    raw = raw.slice(0, 10);
    setDateVal(raw);
    const valid = raw.length === 10 && isValidDate(raw);
    setDateError(raw.length === 10 && !valid);
    skipEmit.current = false;
    if (valid) emit(raw, timeVal);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^\d:]/g, '');
    if (raw.length === 2 && !timeVal.endsWith(':') && !raw.includes(':')) raw += ':';
    raw = raw.slice(0, 5);
    setTimeVal(raw);
    skipEmit.current = false;
    if (dateVal.length === 10 && isValidDate(dateVal) && /^([01]\d|2[0-3]):[0-5]\d$/.test(raw)) emit(dateVal, raw);
  };

  const base = [
    'h-9 px-2.5 rounded-lg border text-[13px] font-semibold focus:outline-none transition',
    disabled
      ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
      : 'bg-[#fbfdfc] text-[#18211f] border-[#dce5e1] focus:border-[#0f766e]',
  ].join(' ');

  return (
    <span className={`inline-flex items-center gap-1.5 ${className}`}>
      <input
        type="text"
        inputMode="numeric"
        placeholder="DD/MM/YYYY"
        value={dateVal}
        onChange={handleDateChange}
        disabled={disabled}
        maxLength={10}
        className={`${base} w-[110px]${dateError ? ' !border-red-400 !text-red-500' : ''}`}
      />
      <input
        type="text"
        inputMode="numeric"
        placeholder="HH:mm"
        value={timeVal}
        onChange={handleTimeChange}
        disabled={disabled}
        maxLength={5}
        className={`${base} w-[90px]`}
      />
    </span>
  );
}
