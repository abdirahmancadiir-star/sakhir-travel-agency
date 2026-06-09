import jsPDF from 'jspdf'
import type { Booking } from './types'

export function generateBookingTicket(booking: Booking, customerName: string | null = 'Traveler') {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const left = 40
  let top = 60

  doc.setFillColor(10, 25, 55)
  doc.rect(0, 0, 595, 840, 'F')
  doc.setFontSize(28)
  doc.setTextColor('#ffd166')
  doc.text('Sakhir Airways Ticket', left, top)

  top += 40
  doc.setFontSize(12)
  doc.setTextColor('#ffffff')
  doc.text(`Passenger: ${customerName}`, left, top)
  top += 18
  doc.text(`Booking ID: ${booking.id}`, left, top)
  top += 18
  doc.text(`Type: ${booking.booking_type}`, left, top)
  top += 18
  doc.text(`Status: ${booking.status}`, left, top)
  top += 30

  doc.setDrawColor('#ffffff')
  doc.setLineWidth(0.5)
  doc.line(left, top, 555, top)
  top += 24

  doc.setFontSize(14)
  doc.text('Travel Details', left, top)
  top += 20
  doc.setFontSize(12)
  if (booking.flight_route) {
    doc.text(`Route: ${booking.flight_route}`, left, top)
    top += 18
  }
  if (booking.cargo_origin || booking.cargo_destination) {
    doc.text(`Cargo route: ${booking.cargo_origin ?? '-'} → ${booking.cargo_destination ?? '-'}`, left, top)
    top += 18
  }
  if (booking.tour_id) {
    doc.text(`Tour ID: ${booking.tour_id}`, left, top)
    top += 18
  }
  if (booking.hotel_id) {
    doc.text(`Hotel ID: ${booking.hotel_id}`, left, top)
    top += 18
  }

  doc.text(`Travel dates: ${booking.start_date} → ${booking.end_date}`, left, top)
  top += 18
  doc.text(`Guests: ${booking.guests}`, left, top)
  top += 18
  doc.text(`Price paid: $${booking.total_price}`, left, top)
  top += 30

  if (booking.notes) {
    doc.setFontSize(14)
    doc.text('Notes', left, top)
    top += 18
    doc.setFontSize(12)
    const split = doc.splitTextToSize(booking.notes, 520)
    doc.text(split, left, top)
  }

  doc.save(`sakhir-ticket-${booking.id}.pdf`)
}
