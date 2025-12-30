import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon } from 'lucide-react';
import { useState } from 'react';

const timeSlots = [
    "9:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM",
    "4:00 PM - 5:00 PM"
];

export default function VisitBooking() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [booked, setBooked] = useState(false);

    const handleBook = (e: React.FormEvent) => {
        e.preventDefault();
        setBooked(true);
    };

    if (booked) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="card max-w-md text-center">
                    <CalendarIcon className="w-16 h-16 text-teal-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Visit Booked!</h2>
                    <p className="text-gray-600 mb-4">
                        Your campus visit is confirmed for <strong>{selectedDate}</strong> at <strong>{selectedSlot}</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                        You will receive a confirmation SMS with directions.
                    </p>
                    <Link to="/visit-booking" className="btn-primary mt-6 inline-block" onClick={() => setBooked(false)}>
                        Book Another Visit
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft className="w-6 h-6" />
                        </Link>
                        <img src="/logo.png" alt="Achariya" className="h-12 w-12" />
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Visit Booking</h1>
                            <p className="text-sm text-gray-600 mt-1">Schedule Your Campus Visit</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleBook} className="card max-w-2xl mx-auto">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Book a Campus Visit</h2>

                    {/* Date Picker */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            required
                            min={new Date().toISOString().split('T')[0]}
                            className="input-field"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>

                    {/* Time Slot Picker */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Select Time Slot <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {timeSlots.map(slot => (
                                <button
                                    type="button"
                                    key={slot}
                                    onClick={() => setSelectedSlot(slot)}
                                    className={`p-4 border-2 rounded-lg text-left transition-all ${selectedSlot === slot
                                            ? 'border-teal-600 bg-teal-50 text-teal-900'
                                            : 'border-gray-200 hover:border-teal-300'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <CalendarIcon className="w-4 h-4" />
                                        <span className="font-medium">{slot}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Student Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Student Name</label>
                            <input type="text" required className="input-field" placeholder="Enter student name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                            <select required className="input-field">
                                <option value="">Select</option>
                                <option>LKG</option>
                                <option>UKG</option>
                                <option>1-12</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name</label>
                            <input type="text" required className="input-field" placeholder="Your name" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                            <input type="tel" required maxLength={10} className="input-field" placeholder="10-digit number" />
                        </div>
                    </div>

                    <button type="submit" className="w-full btn-primary" disabled={!selectedDate || !selectedSlot}>
                        Confirm Visit Booking
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-8">
                    POC Demo - Visit scheduling system
                </p>
            </main>
        </div>
    );
}
