'use client';

import { useState } from 'react';
import { differenceInDays, parseISO } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { storeWeatherData } from '@/lib/api';
import { isAxiosError } from 'axios';

interface InputPanelProps {
    onFileStored: () => void;
}

export default function InputPanel({ onFileStored }: InputPanelProps) {
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Open-Meteo Archive API typically has a delay of about 5 days for fully archived data, 
    // though some recent data might be available. Safe bet is to restrict to past.
    // We'll set the max allowed date to yesterday to prevent "future" errors.
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() - 1);
    const maxDateStr = maxDate.toISOString().split('T')[0];

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);

        // Validation
        const latNum = parseFloat(lat);
        const lonNum = parseFloat(lon);

        if (isNaN(latNum) || latNum < -90 || latNum > 90) {
            setError('Latitude must be between -90 and 90');
            return;
        }
        if (isNaN(lonNum) || lonNum < -180 || lonNum > 180) {
            setError('Longitude must be between -180 and 180');
            return;
        }
        if (!startDate || !endDate) {
            setError('Please select both start and end dates');
            return;
        }

        const start = parseISO(startDate);
        const end = parseISO(endDate);

        if (end < start) {
            setError('End date must be after start date');
            return;
        }

        const daysDiff = differenceInDays(end, start);
        if (daysDiff > 31) {
            setError('Date range must be 31 days or less');
            return;
        }

        setLoading(true);
        try {
            const result = await storeWeatherData({
                latitude: latNum,
                longitude: lonNum,
                start_date: startDate,
                end_date: endDate,
            });
            setMessage(`Success! File stored: ${result.file}`);
            onFileStored();
        } catch (err) {
            console.error(err);
            if (isAxiosError(err)) {
                setError(err.response?.data?.detail || 'Failed to fetch weather data');
            } else {
                setError('Failed to fetch weather data');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Fetch Weather Data</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Latitude</label>
                        <input
                            type="number"
                            step="any"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            placeholder="e.g. 52.52"
                            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Longitude</label>
                        <input
                            type="number"
                            step="any"
                            value={lon}
                            onChange={(e) => setLon(e.target.value)}
                            placeholder="e.g. 13.41"
                            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Start Date</label>
                        <input
                            type="date"
                            max={maxDateStr}
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">End Date</label>
                        <input
                            type="date"
                            max={maxDateStr}
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full p-2 border border-zinc-300 dark:border-zinc-700 rounded-md bg-transparent text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded-md">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-md">
                        {message}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Fetching...
                        </>
                    ) : (
                        'Fetch Data'
                    )}
                </button>
            </form>
        </div>
    );
}
