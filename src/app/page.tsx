'use client';

import { useState } from 'react';
import InputPanel from '@/components/InputPanel';
import FileList from '@/components/FileList';
import WeatherDashboard from '@/components/WeatherDashboard';
import { CloudSun } from 'lucide-react';

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileStored = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans">
      {/* Header */}
      <header className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg text-white">
            <CloudSun className="h-6 w-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">InRisk Weather Explorer</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto md:p-6 p-4">
        <div className="grid md:grid-cols-[320px_1fr] gap-6 items-start">

          {/* Sidebar Area (Desktop) / Top Area (Mobile) */}
          <div className="space-y-6 md:sticky md:top-24">
            {/* Data Fetching Panel */}
            <InputPanel onFileStored={handleFileStored} />

            {/* File List - Hidden on mobile if needed, or shown. 
                 For better UX on mobile, maybe we keep it here but limit height. */}
            <div className="h-[400px] md:h-[calc(100vh-400px)] min-h-[300px] bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
              <FileList onSelectFile={setSelectedFile} refreshTrigger={refreshTrigger} />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="min-h-[500px]">
            <WeatherDashboard filename={selectedFile} />
          </div>

        </div>
      </main>
    </div>
  );
}
