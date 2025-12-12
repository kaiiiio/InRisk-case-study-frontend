'use client';

import { useEffect, useState } from 'react';
import { getWeatherFileContent, WeatherData } from '@/lib/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

interface WeatherDashboardProps {
    filename: string | null;
}

export default function WeatherDashboard({ filename }: WeatherDashboardProps) {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        if (!filename) return;

        const loadData = async () => {
            setLoading(true);
            setError(null);
            try {
                const content = await getWeatherFileContent(filename);
                setData(content);
                setCurrentPage(1); // Reset to first page on new file
            } catch (err) {
                console.error(err);
                setError('Failed to load file content');
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [filename]);

    if (!filename) {
        return (
            <div className="h-full flex items-center justify-center text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800">
                Select a file to view data
            </div>
        );
    }

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center text-blue-600 bg-white dark:bg-zinc-900 rounded-xl">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="h-full flex items-center justify-center text-red-500 bg-white dark:bg-zinc-900 rounded-xl">
                {error || 'No data found'}
            </div>
        );
    }

    // Prepare chart data
    const chartData = data.daily.time.map((date, i) => ({
        date,
        maxTemp: data.daily.temperature_2m_max[i],
        minTemp: data.daily.temperature_2m_min[i],
    }));

    // Prepare table data
    const tableData = data.daily.time.map((date, i) => ({
        date,
        maxTemp: data.daily.temperature_2m_max[i],
        minTemp: data.daily.temperature_2m_min[i],
        appMax: data.daily.apparent_temperature_max[i],
        appMin: data.daily.apparent_temperature_min[i],
    }));

    const totalPages = Math.ceil(tableData.length / rowsPerPage);
    const paginatedData = tableData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">Temperature Trends ({filename})</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-zinc-200 dark:stroke-zinc-700" />
                            <XAxis
                                dataKey="date"
                                className="text-xs"
                                tick={{ fill: '#71717a' }}
                                tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                            />
                            <YAxis
                                className="text-xs"
                                tick={{ fill: '#71717a' }}
                                label={{ value: data.daily_units.temperature_2m_max || '°C', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="maxTemp" stroke="#ef4444" name="Max Temp" strokeWidth={2} dot={false} />
                            <Line type="monotone" dataKey="minTemp" stroke="#3b82f6" name="Min Temp" strokeWidth={2} dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Daily Data</h3>
                    <select
                        value={rowsPerPage}
                        onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                        className="text-sm p-1 border rounded bg-transparent dark:text-zinc-300"
                    >
                        <option value={10}>10 per page</option>
                        <option value={20}>20 per page</option>
                        <option value={50}>50 per page</option>
                    </select>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-500 uppercase bg-zinc-50 dark:bg-zinc-800/50">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Max Temp ({data.daily_units.temperature_2m_max})</th>
                                <th className="px-6 py-3">Min Temp ({data.daily_units.temperature_2m_min})</th>
                                <th className="px-6 py-3">Apparc. Max ({data.daily_units.apparent_temperature_max})</th>
                                <th className="px-6 py-3">Apparc. Min ({data.daily_units.apparent_temperature_min})</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {paginatedData.map((row) => (
                                <tr key={row.date} className="bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{row.date}</td>
                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{row.maxTemp}</td>
                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{row.minTemp}</td>
                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{row.appMax}</td>
                                    <td className="px-6 py-4 text-zinc-600 dark:text-zinc-400">{row.appMin}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-sm text-zinc-500">
                        Page {currentPage} of {totalPages}
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1 px-3 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1 px-3 border border-zinc-300 dark:border-zinc-700 rounded hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
