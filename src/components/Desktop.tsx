import { useState, lazy, Suspense } from "react";

const PortfolioApp = lazy(() => import("../portfolio/pages"));

export default function Desktop() {
  const [showPortfolio, setShowPortfolio] = useState(false);

  const handleOpenPortfolio = () => setShowPortfolio(true);
  const handleClosePortfolio = () => setShowPortfolio(false);

  return (
    <div className="w-full h-full flex flex-col bg-blue-900 text-white font-sans overflow-hidden">
        {/* Main Desktop Area */}
        <div className="relative flex-1 overflow-hidden">
            {/* Desktop Shortcut */}
            <div
                onDoubleClick={handleOpenPortfolio}
                className="absolute top-8 left-8 flex flex-col items-center cursor-pointer select-none"
            >
                <div className="w-12 h-12 bg-white bg-opacity-10 rounded-md flex items-center justify-center text-xl">
                    🗂️
                </div>
                <span className="text-sm mt-1">Portfolio</span>
            </div>

            {/* Mock Window */}
            {showPortfolio && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-800 rounded shadow-lg z-10 flex flex-col">
                {/* Title Bar */}
                <div className="flex items-center justify-between bg-gray-700 p-2 text-sm">
                    <span>Portfolio - Mock Browser</span>
                    <button
                        onClick={handleClosePortfolio}
                        className="text-red-400 hover:text-red-600"
                    >
                        ✖
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto bg-white text-black">
                    <Suspense fallback={<div className="p-4">Loading Portfolio...</div>}>
                        <PortfolioApp />
                    </Suspense>
                </div>
                </div>
            )}
        </div>

        {/* Taskbar */}
        <div className="h-10 bg-gray-900 text-white flex items-center px-4 space-x-4">
            <span className="text-sm">Start</span>
            <span className="text-xs opacity-60 ml-auto">
                {new Date().toLocaleTimeString()}
            </span>
        </div>
    </div>
  );
}
