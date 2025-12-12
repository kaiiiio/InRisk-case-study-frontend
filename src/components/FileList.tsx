'use client';

import { useEffect, useState } from 'react';
import { listWeatherFiles, WeatherFile } from '@/lib/api';
import { FileText, RefreshCw } from 'lucide-react';
import clsx from 'clsx';

interface FileListProps {
    onSelectFile: (filename: string) => void;
    refreshTrigger: number; // Increment to trigger refresh
}

export default function FileList({ onSelectFile, refreshTrigger }: FileListProps) {
    const [files, setFiles] = useState<WeatherFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const data = await listWeatherFiles();
            console.log('API Response for files:', data);

            if (!Array.isArray(data)) {
                console.error('Expected array from listWeatherFiles but got:', data);
                setFiles([]);
                return;
            }

            // Sort by created_at desc (assuming name or just recent first)
            // If created_at is strictly ISO, string sort works.
            const sorted = [...data].sort((a, b) => {
                const dateA = a.created_at || '';
                const dateB = b.created_at || '';
                return dateB.localeCompare(dateA);
            });
            setFiles(sorted);
        } catch (err) {
            console.error('Failed to load files', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, [refreshTrigger]);

    const handleSelect = (file: WeatherFile) => {
        setSelectedFile(file.name);
        onSelectFile(file.name);
    };

    return (
        <div className="bg-white dark:bg-zinc-900 flex flex-col h-full border-r border-zinc-200 dark:border-zinc-800">
            <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Saved Files</h2>
                <button onClick={fetchFiles} className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md">
                    <RefreshCw className={clsx("h-4 w-4 text-zinc-500", loading && "animate-spin")} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {files.length === 0 && !loading && (
                    <div className="text-center py-8 text-sm text-zinc-500">No files found</div>
                )}

                {files.map((file) => (
                    <button
                        key={file.name}
                        onClick={() => handleSelect(file)}
                        className={clsx(
                            "w-full text-left p-3 rounded-md text-sm transition-colors group",
                            selectedFile === file.name
                                ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 ring-1 ring-blue-200 dark:ring-blue-800"
                                : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50 text-zinc-700 dark:text-zinc-300"
                        )}
                    >
                        <div className="flex items-start gap-3">
                            <FileText className="h-5 w-5 mt-0.5 text-zinc-400 shrink-0" />
                            <div className="min-w-0">
                                <div className="font-medium truncate">{file.name}</div>
                                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                                    {new Date(file.created_at).toLocaleString()}
                                </div>
                                <div className="text-xs text-zinc-400 mt-0.5">
                                    {(file.size_bytes / 1024).toFixed(1)} KB
                                </div>
                            </div>
                        </div>
                    </button>
                ))}

                {loading && files.length === 0 && (
                    <div className="p-4 text-center text-sm text-zinc-500">Loading...</div>
                )}
            </div>
        </div>
    );
}
