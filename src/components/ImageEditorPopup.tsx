// ImageEditorPopup.tsx
import React, { useEffect, useRef, useState } from 'react';
import { DamageAnnotation } from '../types/types';

interface ImageEditorPopupProps {
  image: string;
  annotations: DamageAnnotation[];
  dimensions: { width: number; height: number };
  onClose: () => void;
  onSave: (annotations: DamageAnnotation[], updatedBase64?: string) => void;
}

export const ImageEditorPopup: React.FC<ImageEditorPopupProps> = ({
  image,
  annotations: initialAnnotations,
  dimensions,
  onClose,
  onSave,
}) => {
  const [annotations, setAnnotations] = useState<DamageAnnotation[]>(initialAnnotations);
  const [selectedAnnotation, setSelectedAnnotation] = useState<number | null>(null);
  const [color, setColor] = useState<string>('#FF0000');
  const [tool, setTool] = useState<'circle' | 'square' | 'line' | 'arrow' | 'text'>('square');
  const [textInput, setTextInput] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    drawCanvas();
  }, [annotations, selectedAnnotation]);
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
      annotations.forEach((ann, i) => {
        ctx.strokeStyle = ann.color || '#000000';
        ctx.lineWidth = i === selectedAnnotation ? 4 : 2;
  
        const x = ann.x * canvas.width;
        const y = ann.y * canvas.height;
        const w = ann.width * canvas.width;
        const h = ann.height * canvas.height;
  
        ctx.save(); // 🛟 Save the current canvas state
  
        // 🌀 Move to center of annotation and rotate
        ctx.translate(x + w / 2, y + h / 2);
        ctx.rotate((ann.rotation || 0) * Math.PI / 180);
        ctx.translate(-w / 2, -h / 2);
  
        // 🖌️ Now draw relative to rotated center
        if (ann.type === 'square') {
          ctx.strokeRect(0, 0, w, h);
        } 
        else if (ann.type === 'circle') {
          ctx.beginPath();
          ctx.ellipse(w / 2, h / 2, w / 2, h / 2, 0, 0, 2 * Math.PI);
          ctx.stroke();
        }
        else if (ann.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(w, h);
          ctx.stroke();
        }
        else if (ann.type === 'arrow') {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(w, h);
          ctx.stroke();
  
          const headlen = 10;
          const angle = Math.atan2(h, w);
          ctx.beginPath();
          ctx.moveTo(w, h);
          ctx.lineTo(w - headlen * Math.cos(angle - Math.PI / 6), h - headlen * Math.sin(angle - Math.PI / 6));
          ctx.lineTo(w - headlen * Math.cos(angle + Math.PI / 6), h - headlen * Math.sin(angle + Math.PI / 6));
          ctx.lineTo(w, h);
          ctx.fillStyle = ann.color || '#000000';
          ctx.fill();
        }
        else if (ann.type === 'text') {
          const fontSize = Math.max(10, Math.min(w, h) * 0.6); // 🔥 scale font size to box size
          ctx.font = `${fontSize}px sans-serif`;
          ctx.fillStyle = ann.color || '#000000';
          ctx.fillText(ann.text || '', 0, fontSize); // 🔥 start a little down inside the box
        }
        
  
        ctx.restore(); // ♻️ Restore to original state for next annotation


      });
    };
    img.src = image;
  };
  

  
  const handleAddAnnotation = () => {
    const newAnnotation: DamageAnnotation = {
      type: tool,
      x: 0.1,
      y: 0.1,
      width: 0.2,
      height: 0.2,
      confidence: 1,
      description: '',
      severity: 'Medium',
      repairRecommendation: '',
      isAdjusted: true,
      adjustmentReason: 'Manually added',
      text: tool === 'text' ? textInput : undefined,
      color,
      rotation: 0,
    };
    
    
    setAnnotations([...annotations, newAnnotation]);
    setSelectedAnnotation(annotations.length);
  };

  const handleDeleteAnnotation = (index: number) => {
    setAnnotations(annotations.filter((_, i) => i !== index));
    setSelectedAnnotation(null);
  };


  const moveSelectedAnnotation = (direction: 'left' | 'right' | 'up' | 'down') => {
    if (selectedAnnotation === null) return;
    const amount = 0.02; // 2% move per click
    setAnnotations(prev =>
      prev.map((ann, i) =>
        i === selectedAnnotation
          ? {
              ...ann,
              x: Math.max(0, Math.min(1 - ann.width, direction === 'left' ? ann.x - amount : direction === 'right' ? ann.x + amount : ann.x)),
              y: Math.max(0, Math.min(1 - ann.height, direction === 'up' ? ann.y - amount : direction === 'down' ? ann.y + amount : ann.y)),
            }
          : ann
      )
    );
  };
  

  const resizeAnnotation = (direction: 'in' | 'out') => {
    if (selectedAnnotation === null) return;
    const factor = direction === 'in' ? 1.1 : 0.9;
    setAnnotations((prev) =>
      prev.map((ann, i) =>
        i === selectedAnnotation
          ? {
              ...ann,
              width: Math.min(1, Math.max(0.01, ann.width * factor)),
              height: Math.min(1, Math.max(0.01, ann.height * factor)),
            }
          : ann
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between mb-4">
          <h2 className="text-2xl font-bold text-[#002147]">Edit Image Annotations</h2>
          <button onClick={onClose} className="text-gray-500">✕</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <select value={tool} onChange={(e) => setTool(e.target.value as any)} className="border rounded px-2 py-1">
                <option value="square">Square</option>
                <option value="circle">Circle</option>
                <option value="line">Line</option>
                <option value="arrow">Arrow</option>
                <option value="text">Text</option>
              </select>
              <input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-10 h-10 p-1 border rounded" />
              {tool === 'text' && (
                <input
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text..."
                  className="border px-2 py-1 rounded"
                />
              )}
              <button onClick={handleAddAnnotation} className="bg-[#002147] text-white px-3 py-1 rounded hover:bg-[#003167]">+ Add</button>
              {selectedAnnotation !== null && (
                <>
                  <button onClick={() => resizeAnnotation('in')} className="px-2 py-1 border rounded text-sm">➕ Enlarge</button>
                  <button onClick={() => resizeAnnotation('out')} className="px-2 py-1 border rounded text-sm">➖ Shrink</button>
                  <div className="flex gap-2 flex-wrap mt-4">
  <button onClick={() => moveSelectedAnnotation('left')} className="px-2 py-1 border rounded text-sm">⬅️ Left</button>
  <button onClick={() => moveSelectedAnnotation('right')} className="px-2 py-1 border rounded text-sm">➡️ Right</button>
  <button onClick={() => moveSelectedAnnotation('up')} className="px-2 py-1 border rounded text-sm">⬆️ Up</button>
  <button onClick={() => moveSelectedAnnotation('down')} className="px-2 py-1 border rounded text-sm">⬇️ Down</button>
</div>

                </>
              )}
            </div>

            <canvas
  ref={canvasRef}
  width={dimensions.width}
  height={dimensions.height}
  className="border rounded w-full"
/>

          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#002147]">Annotations</h3>
            {annotations.length === 0 ? (
              <p className="text-gray-500 italic">No annotations yet. Use tools above to add shapes or text.</p>
            ) : (
              annotations.map((ann, i) => (
<div
  key={i}
  onClick={() => setSelectedAnnotation(i)}
  className={`p-4 border rounded cursor-pointer ${
    i === selectedAnnotation ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
  }`}
>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-[#002147]">Annotation {i + 1}</span>
                    <button onClick={() => handleDeleteAnnotation(i)} className="text-red-500">Delete</button>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
  <p>Type: <strong>{ann.type}</strong></p>
  {ann.type === 'text' && <p>Text: <strong>{ann.text}</strong></p>}
  <p>Color: <span style={{ backgroundColor: ann.color || '#000' }} className="inline-block w-4 h-4 rounded border" /></p>

  {/* 🎯 Rotation Control */}
  <div className="flex items-center space-x-2">
    <label className="text-xs">Rotate:</label>
    <input
      type="range"
      min={-180}
      max={180}
      step={1}
      value={ann.rotation || 0}
      onChange={(e) => {
        const newAnnotations = [...annotations];
        newAnnotations[i].rotation = parseInt(e.target.value);
        setAnnotations(newAnnotations);
      }}
      className="flex-1"
    />
    <span className="text-xs">{ann.rotation || 0}°</span>
  </div>
</div>

                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end mt-6 space-x-4">
          <button onClick={onClose} className="border px-4 py-2 rounded">Cancel</button>
          <button
  onClick={() => {
    const canvas = canvasRef.current;
    const updatedBase64 = canvas?.toDataURL("image/png");
    onSave(annotations, updatedBase64);
    setSelectedAnnotation(null); // 👈 reset selection when saving!
  }}
  className="bg-[#002147] text-white px-4 py-2 rounded hover:bg-[#003167]"
>
  Save Changes
</button>

        </div>
      </div>
    </div>
  );
};
