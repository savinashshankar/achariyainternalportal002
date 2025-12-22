import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker - use local file instead of CDN
if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
}

interface SlideBySlideViewerProps {
    pdfUrl: string;
}

const SlideBySlideViewer = ({ pdfUrl }: SlideBySlideViewerProps) => {
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [renderingPage, setRenderingPage] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pdfDocRef = useRef<any>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Touch swipe state
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        loadPdf();
    }, [pdfUrl]);

    useEffect(() => {
        if (pdfDocRef.current && currentPage && !renderingPage) {
            renderPage(currentPage);
        }
    }, [currentPage]);

    // P0-4: Lock body scroll when fullscreen on mobile
    useEffect(() => {
        if (isFullscreen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isFullscreen]);

    const loadPdf = async () => {
        setLoading(true);
        setError(null);
        try {
            const encodedUrl = encodeURI(pdfUrl);
            console.log('Loading PDF from:', encodedUrl);

            const response = await fetch(encodedUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const arrayBuffer = await response.arrayBuffer();

            const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
            const pdf = await loadingTask.promise;
            pdfDocRef.current = pdf;
            setNumPages(pdf.numPages);
            // P0-4: Ensure slide 1 loads reliably
            setCurrentPage(1);
            console.log(`PDF loaded successfully. Total pages: ${pdf.numPages}`);
            // Render first page after state update
            setTimeout(() => renderPage(1), 100);
        } catch (error: any) {
            console.error('Error loading PDF:', error);
            setError(`Failed to load presentation: ${error.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const renderPage = async (pageNum: number) => {
        if (!pdfDocRef.current || !canvasRef.current || renderingPage) return;

        setRenderingPage(true);
        try {
            const page = await pdfDocRef.current.getPage(pageNum);
            // P0-4: Responsive scale based on container width
            const containerWidth = containerRef.current?.clientWidth || 800;
            const viewport = page.getViewport({ scale: 1 });
            const scale = Math.min(containerWidth / viewport.width * 0.95, 2);
            const scaledViewport = page.getViewport({ scale });

            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.height = scaledViewport.height;
            canvas.width = scaledViewport.width;

            const renderContext = {
                canvasContext: context!,
                viewport: scaledViewport
            };

            await page.render(renderContext).promise;
        } catch (error) {
            console.error('Error rendering page:', error);
        } finally {
            setRenderingPage(false);
        }
    };

    const goToPrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const goToNext = () => {
        if (currentPage < numPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    // P0-4: Swipe navigation handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const diff = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (Math.abs(diff) > minSwipeDistance) {
            if (diff > 0) {
                // Swiped left - go to next
                goToNext();
            } else {
                // Swiped right - go to previous
                goToPrevious();
            }
        }
    };

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        // Re-render after fullscreen toggle to adjust scale
        setTimeout(() => renderPage(currentPage), 100);
    };

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px] bg-red-50 rounded-lg border-2 border-red-200">
                <div className="text-center p-4 md:p-8">
                    <div className="text-red-600 text-4xl md:text-6xl mb-4">⚠️</div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">Failed to Load Slides</h3>
                    <p className="text-sm md:text-base text-gray-600 mb-4">{error}</p>
                    <p className="text-xs md:text-sm text-gray-500">Make sure the PDF file exists and is accessible.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading slides...</p>
                </div>
            </div>
        );
    }

    // P0-4: Fullscreen modal for mobile
    if (isFullscreen) {
        return (
            <div className="fixed inset-0 bg-black z-50 flex flex-col">
                {/* Fullscreen header */}
                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-10">
                    <span className="text-white text-sm font-medium">
                        Slide {currentPage} of {numPages}
                    </span>
                    <button
                        onClick={toggleFullscreen}
                        className="p-2 bg-white/20 rounded-full text-white hover:bg-white/30 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Fullscreen canvas with swipe */}
                <div
                    ref={containerRef}
                    className="flex-1 flex items-center justify-center p-4"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    {renderingPage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                        </div>
                    )}
                    <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                </div>

                {/* Fullscreen navigation */}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex justify-center gap-4 bg-gradient-to-t from-black/50 to-transparent">
                    <button
                        onClick={goToPrevious}
                        disabled={currentPage === 1}
                        className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 disabled:opacity-30 transition"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        disabled={currentPage === numPages}
                        className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 disabled:opacity-30 transition"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Canvas for PDF rendering with swipe support */}
            <div
                ref={containerRef}
                className="bg-white rounded-lg shadow-lg p-2 md:p-4 flex items-center justify-center overflow-hidden relative min-h-[250px] md:min-h-[400px]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {renderingPage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                )}
                <canvas ref={canvasRef} className="max-w-full h-auto" />

                {/* Fullscreen button */}
                <button
                    onClick={toggleFullscreen}
                    className="absolute top-2 right-2 md:top-4 md:right-4 p-2 bg-gray-800/70 rounded-full text-white hover:bg-gray-800 transition"
                >
                    <Maximize2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-between bg-white rounded-lg p-3 md:p-4 shadow-sm">
                <button
                    onClick={goToPrevious}
                    disabled={currentPage === 1}
                    className="flex items-center px-3 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 mr-1 md:mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                </button>

                <span className="text-gray-700 font-semibold text-sm md:text-base">
                    {currentPage} / {numPages}
                </span>

                <button
                    onClick={goToNext}
                    disabled={currentPage === numPages}
                    className="flex items-center px-3 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ChevronRight className="w-4 h-4 md:w-5 md:h-5 ml-1 md:ml-2" />
                </button>
            </div>

            <p className="text-xs md:text-sm text-gray-500 text-center">
                📊 Swipe or use buttons to navigate • Tap expand for fullscreen
            </p>
        </div>
    );
};

export default SlideBySlideViewer;

