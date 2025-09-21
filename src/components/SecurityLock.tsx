import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Lock, Unlock, Shield } from 'lucide-react';

interface SecurityLockProps {
  onUnlock: () => void;
  isDarkMode: boolean;
}

interface RainParticle {
  x: number;
  y: number;
  char: string;
  speed: number;
  alpha: number;
  startY: number;
}

const SecurityLock: React.FC<SecurityLockProps> = ({ onUnlock, isDarkMode }) => {
  const [pattern, setPattern] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentMousePos, setCurrentMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<RainParticle[]>([]);

  const createParticle = useCallback((x: number, y: number): RainParticle => {
    const characters = '01';
    return {
      x,
      y,
      char: characters.charAt(Math.floor(Math.random() * characters.length)),
      speed: 2,
      alpha: 1,
      startY: y,
    };
  }, []);

  // The correct pattern from your image: starts from top-left (3), goes to center (5), then follows the drawn path
  const correctPattern = [3, 2, 5, 4, 1, 7, 8, 9, 6]; // Based on the blue line in your image

  const dots = [
    { id: 1, x: 100, y: 200, number: 1 }, // Bottom left
    { id: 2, x: 200, y: 100, number: 2 }, // Top center  
    { id: 3, x: 300, y: 100, number: 3 }, // Top right
    { id: 4, x: 100, y: 150, number: 4 }, // Middle left
    { id: 5, x: 200, y: 150, number: 5 }, // Center
    { id: 6, x: 300, y: 150, number: 6 }, // Middle right
    { id: 7, x: 100, y: 100, number: 7 }, // Top left
    { id: 8, x: 200, y: 200, number: 8 }, // Bottom center
    { id: 9, x: 300, y: 200, number: 9 }, // Bottom right
  ];

  useEffect(() => {
    const handleInteractionMove = (clientX: number, clientY: number) => {
      if (isDrawing) {
        if (svgRef.current) {
          const rect = svgRef.current.getBoundingClientRect();
          setCurrentMousePos({
            x: clientX - rect.left,
            y: clientY - rect.top,
          });
        }

        particlesRef.current.push(createParticle(clientX, clientY));
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      handleInteractionMove(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        handleInteractionMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
    };
  }, [isDrawing, createParticle]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasDimensions();

    window.addEventListener('resize', setCanvasDimensions);

    let animationFrameId: number;

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const maxTravelDistance = 150;

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        const travelDistance = p.y - p.startY;

        if (travelDistance > maxTravelDistance) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        p.alpha = 1 - (travelDistance / maxTravelDistance);

        ctx.fillStyle = `rgba(0, 255, 0, ${p.alpha})`;
        ctx.font = '16px monospace';
        ctx.fillText(p.char, p.x, p.y);

        p.y += p.speed;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseDown = (dotId: number) => {
    setIsDrawing(true);
    setPattern([dotId]);
    setShowError(false);
  };

  const handleMouseEnter = (dotId: number) => {
    if (isDrawing && !pattern.includes(dotId)) {
      setPattern(prev => [...prev, dotId]);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    
    // Check if pattern matches the correct one
    if (JSON.stringify(pattern) === JSON.stringify(correctPattern)) {
      // Correct pattern - show success animation then unlock
      setTimeout(() => {
        onUnlock();
      }, 800);
    } else if (pattern.length > 0) {
      // Wrong pattern - show error
      setShowError(true);
      setTimeout(() => {
        setPattern([]);
        setShowError(false);
      }, 1500);
    }
  };

  const getPathD = () => {
    if (pattern.length < 2) return '';
    
    const pathDots = pattern.map(id => dots.find(dot => dot.id === id)!);
    let d = `M ${pathDots[0].x} ${pathDots[0].y}`;
    
    for (let i = 1; i < pathDots.length; i++) {
      d += ` L ${pathDots[i].x} ${pathDots[i].y}`;
    }
    
    if (isDrawing && pattern.length > 0) {
      d += ` L ${currentMousePos.x} ${currentMousePos.y}`;
    }
    
    return d;
  };

  const isCorrectPattern = JSON.stringify(pattern) === JSON.stringify(correctPattern);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900"></div>
      
      <div className="relative z-20 text-center">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center shadow-2xl">
                <Shield className="w-10 h-10 text-white" />
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 w-20 h-20 bg-blue-500 rounded-full blur-xl opacity-30 animate-pulse"></div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Family Security</h1>
          <p className="text-gray-400 text-lg">Draw the pattern to unlock</p>
        </div>

        {/* Pattern Lock Grid */}
        <div className="relative mb-8">
          <svg
            ref={svgRef}
            width="400"
            height="300"
            className="mx-auto"
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchEnd={handleMouseUp}
            onTouchCancel={handleMouseUp}
            onTouchMove={(e) => {
              if (isDrawing && e.touches.length > 0) {
                const touch = e.touches[0];
                const element = document.elementFromPoint(touch.clientX, touch.clientY);
                if (element) {
                  const dotId = element.getAttribute('data-dot-id');
                  if (dotId) {
                    handleMouseEnter(parseInt(dotId, 10));
                  }
                }
              }
            }}
          >
            {/* Grid background lines */}
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* Pattern Trail */}
            {pattern.length > 1 && (
              <path
                d={getPathD()}
                stroke={showError ? '#ef4444' : isCorrectPattern ? '#10b981' : '#22c55e'}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="drop-shadow-lg"
                style={{
                  filter: 'url(#glow)',
                  strokeDasharray: showError ? '10, 5' : 'none',
                  animation: showError ? 'pulse 0.5s ease-in-out infinite' : 'none'
                }}
              />
            )}

            {/* Pattern Dots */}
            {dots.map((dot) => {
              const isActive = pattern.includes(dot.id);
              const isError = showError && pattern.includes(dot.id);
              const isSuccess = isCorrectPattern && pattern.includes(dot.id);
              const patternIndex = pattern.indexOf(dot.id);
              
              return (
                <g key={dot.id}>
                  {/* Outer glow for active dots */}
                  {isActive && (
                    <circle
                      cx={dot.x}
                      cy={dot.y}
                      r="35"
                      fill={isError ? '#ef4444' : isSuccess ? '#10b981' : '#3b82f6'}
                      opacity="0.2"
                      className="animate-pulse"
                    />
                  )}
                  
                  {/* Main dot outer ring */}
                  <circle
                    data-dot-id={dot.id}
                    cx={dot.x}
                    cy={dot.y}
                    r="20"
                    className={`cursor-pointer transition-all duration-300 ${
                      isActive 
                        ? isError
                          ? 'fill-red-600 stroke-red-400'
                          : isSuccess
                            ? 'fill-green-600 stroke-green-400'
                            : 'fill-blue-600 stroke-blue-400'
                        : 'fill-gray-700 stroke-gray-500 hover:fill-gray-600 hover:stroke-gray-400'
                    }`}
                    strokeWidth="2"
                    onMouseDown={() => handleMouseDown(dot.id)}
                    onTouchStart={() => handleMouseDown(dot.id)}
                    onMouseEnter={() => handleMouseEnter(dot.id)}
                    style={{
                      filter: isActive ? 'url(#glow)' : 'none'
                    }}
                  />
                  
                  {/* Inner dot */}
                  <circle
                    cx={dot.x}
                    cy={dot.y}
                    r={isActive ? "8" : "6"}
                    className={`pointer-events-none transition-all duration-300 ${
                      isActive 
                        ? isError
                          ? 'fill-red-300'
                          : isSuccess
                            ? 'fill-green-300'
                            : 'fill-blue-300'
                        : 'fill-gray-400'
                    }`}
                  />
                  
                  {/* Pattern sequence number */}
                  {isActive && patternIndex >= 0 && (
                    <text
                      x={dot.x}
                      y={dot.y + 5}
                      textAnchor="middle"
                      className="text-sm font-bold fill-white pointer-events-none"
                      style={{ filter: 'url(#glow)' }}
                    >
                      {patternIndex + 1}
                    </text>
                  )}

                  {/* Dot number label */}
                  <text
                    x={dot.x}
                    y={dot.y + 45}
                    textAnchor="middle"
                    className="text-xs fill-gray-500 pointer-events-none font-medium"
                  >
                    {dot.number}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Status Messages */}
        <div className="h-12 flex items-center justify-center">
          {showError && (
            <div className="flex items-center space-x-2 text-red-400 animate-bounce">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <p className="text-sm font-medium">Incorrect pattern. Try again.</p>
            </div>
          )}
          
          {isCorrectPattern && !showError && (
            <div className="flex items-center space-x-2 text-green-400">
              <Unlock className="w-4 h-4" />
              <p className="text-sm font-medium">Pattern correct! Unlocking...</p>
            </div>
          )}
          
          {pattern.length === 0 && !showError && (
            <p className="text-gray-500 text-sm">
              Hint: Draw a square starting from top-left
            </p>
          )}
        </div>

        {/* Progress indicator */}
        <div className="mt-8 flex justify-center space-x-2">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i < pattern.length
                  ? showError
                    ? 'bg-red-400'
                    : isCorrectPattern
                      ? 'bg-green-400'
                      : 'bg-blue-400'
                  : 'bg-gray-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecurityLock;