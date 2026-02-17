'use client'

import DatePicker, { registerLocale } from 'react-datepicker'
import { tr } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('tr', tr)

// YYYY-MM-DD string → Date
function strToDate(str) {
  if (!str) return null
  return new Date(str + 'T00:00:00')
}

// Date → YYYY-MM-DD string
function dateToStr(date) {
  if (!date) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export default function DatePickerTR({ value, onChange, minDate, placeholder = 'gg/aa/yyyy', className = '', inputClassName = '' }) {
  const selected = strToDate(value)
  const min = strToDate(minDate)

  return (
    <DatePicker
      locale="tr"
      selected={selected}
      onChange={(date) => onChange(dateToStr(date))}
      minDate={min}
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder}
      className={inputClassName}
      wrapperClassName={className}
      showPopperArrow={false}
      autoComplete="off"
      portalId="datepicker-portal"
      popperPlacement="bottom-start"
    />
  )
}
