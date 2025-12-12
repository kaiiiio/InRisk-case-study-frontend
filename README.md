# InRisk Weather Explorer (Frontend)

A modern Next.js dashboard for exploring historical weather data. This application interacts with the InRisk Backend Service to fetch, store, and visualize historical weather data from the Open-Meteo Archive API.

## Features

-   **Data Ingestion**: Fetch historical weather data (Max/Min Temp, Apparent Temp) for any location (Lat/Lon) and date range.
    -   *Constraint*: Date range must be $\le$ 31 days.
    -   *Source*: Open-Meteo Archive API.
-   **File Management**: View a list of stored weather data files.
    -   Files are sorted by creation time.
    -   Supports sorting and refreshing.
-   **Visualization**: Interactive charts and tables.
    -   Line charts utilizing **Recharts**.
    -   Paginated data tables.
-   **Responsive Design**: Built with **Tailwind CSS** for a mobile-friendly experience.

## Tech Stack

-   **Framework**: Next.js 15 (App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **Charts**: Recharts
-   **Icons**: Lucide React
-   **HTTP Client**: Axios
-   **Date Handling**: Date-fns

## Getting Started

### Prerequisites

-   Node.js (v18+)
-   Running instance of `InRisk-case-study-backend` (Default: `http://localhost:8000` or production URL).

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd InRisk-case-study-frontend
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Configure Environment:
    Create a `.env.local` file in the root directory:
    ```bash
    NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
    # Or your production backend URL
    # NEXT_PUBLIC_API_BASE_URL=https://insrisk-weather-service-xxxx.run.app
    ```

4.  Run Development Server:
    ```bash
    npm run dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

-   `src/app`: Next.js App Router pages.
-   `src/components`: UI components (`InputPanel`, `FileList`, `WeatherDashboard`).
-   `src/lib`: Utilities and API clients.

