import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

export function DesignCanvas({ onCanvasReady }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 500,
      height: 600,
      backgroundColor: '#ffffff',
    });

    // Enable object controls
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerColor = '#00a0f5';
    fabric.Object.prototype.cornerStyle = 'circle';

    onCanvasReady(canvas);

    return () => {
      canvas.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} />;
}
