import React, { useEffect, useRef, useState } from 'react';
import { DamageAnnotation } from '../types/types';

interface ImageEditorPopupProps {
  image: string;
  annotations: DamageAnnotation[];
  dimensions: { width: number; height: number };
  onClose: () => void;
  onSave: (annotations: DamageAnnotation[]) => void;
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
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragMode, setDragMode] = useState<'move' | 'resize' | null>(null);
  const [resizeHandle, setResizeHandle] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const severityColors = {
    'Low': '#FFD700',
    'Medium': '#FFA500',
    'High': '#FF4500',
    'Critical': '#FF0000'
  };

  useEffect(() => {
    drawCanvas();
  }, [annotations, selectedAnnotation]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw image
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Draw annotations
      annotations.forEach((annotation, index) => {
        const isSelected = index === selectedAnnotation;
        ctx.strokeStyle = isSelected ? '#00FF00' : severityColors[annotation.severity];
        ctx.lineWidth = isSelected ? 4 : 3;

        const x = annotation.x * canvas.width;
        const y = annotation.y * canvas.height;
        const width = annotation.width * canvas.width;
        const height = annotation.height * canvas.height;

        if (annotation.type === 'square') {
          ctx.strokeRect(x, y, width, height);
        } else {
          ctx.beginPath();
          ctx.ellipse(
            x + width / 2,
            y + height / 2,
            width / 2,
            height / 2,
            0,
            0,
            2 * Math.PI
          );
          ctx.stroke();
        }

        // Draw handles if selected
        if (isSelected) {
          drawResizeHandles(ctx, x, y, width, height);
        }

        // Add label
        ctx.font = '14px Arial';
        ctx.fillStyle = isSelected ? '#00FF00' : severityColors[annotation.severity];
        ctx.fillText(annotation.severity, x, y - 5);
      });
    };
    img.src = image;
  };

  const drawResizeHandles = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number
  ) => {
    const handleSize = 8;
    const handles = [
      { x, y }, // Top-left
      { x: x + width / 2, y }, // Top-middle
      { x: x + width, y }, // Top-right
      { x, y: y + height / 2 }, // Middle-left
      { x: x + width, y: y + height / 2 }, // Middle-right
      { x, y: y + height }, // Bottom-left
      { x: x + width / 2, y: y + height }, // Bottom-middle
      { x: x + width, y: y + height }, // Bottom-right
    ];

    ctx.fillStyle = '#00FF00';
    handles.forEach(handle => {
      ctx.fillRect(
        handle.x - handleSize / 2,
        handle.y - handleSize / 2,
        handleSize,
        handleSize
      );
    });
  };

  const isOverResizeHandle = (
    x: number,
    y: number,
    annotation: DamageAnnotation,
    handleIndex: number
  ): boolean => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    const handleSize = 8;
    const annX = annotation.x * canvas.width;
    const annY = annotation.y * canvas.height;
    const annWidth = annotation.width * canvas.width;
    const annHeight = annotation.height * canvas.height;

    const handles = [
      { x: annX, y: annY }, // Top-left
      { x: annX + annWidth / 2, y: annY }, // Top-middle
      { x: annX + annWidth, y: annY }, // Top-right
      { x: annX, y: annY + annHeight / 2 }, // Middle-left
      { x: annX + annWidth, y: annY + annHeight / 2 }, // Middle-right
      { x: annX, y: annY + annHeight }, // Bottom-left
      { x: annX + annWidth / 2, y: annY + annHeight }, // Bottom-middle
      { x: annX + annWidth, y: annY + annHeight }, // Bottom-right
    ];

    const handle = handles[handleIndex];
    return (
      x >= handle.x - handleSize / 2 &&
      x <= handle.x + handleSize / 2 &&
      y >= handle.y - handleSize / 2 &&
      y <= handle.y + handleSize / 2
    );
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    // Check if clicking on a resize handle first
    if (selectedAnnotation !== null) {
      for (let i = 0; i < 8; i++) {
        if (isOverResizeHandle(x, y, annotations[selectedAnnotation], i)) {
          setDragMode('resize');
          setResizeHandle(i);
          setIsDragging(true);
          setDragStart({ x: e.clientX, y: e.clientY });
          return;
        }
      }
    }

    // Check if clicking on an existing annotation
    const clickedIndex = annotations.findIndex(ann => {
      const annX = ann.x * canvas.width;
      const annY = ann.y * canvas.height;
      const annWidth = ann.width * canvas.width;
      const annHeight = ann.height * canvas.height;
      return x >= annX && x <= annX + annWidth && y >= annY && y <= annY + annHeight;
    });

    if (clickedIndex !== -1) {
      setSelectedAnnotation(clickedIndex);
      setDragMode('move');
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setSelectedAnnotation(null);
      setDragMode(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedAnnotation === null || !dragMode) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const deltaX = ((e.clientX - dragStart.x) * scaleX) / canvas.width;
    const deltaY = ((e.clientY - dragStart.y) * scaleY) / canvas.height;

    setAnnotations(annotations.map((ann, index) => {
      if (index !== selectedAnnotation) return ann;

      if (dragMode === 'move') {
        return {
          ...ann,
          x: Math.max(0, Math.min(1 - ann.width, ann.x + deltaX)),
          y: Math.max(0, Math.min(1 - ann.height, ann.y + deltaY))
        };
      } else if (dragMode === 'resize' && resizeHandle !== null) {
        let newX = ann.x;
        let newY = ann.y;
        let newWidth = ann.width;
        let newHeight = ann.height;

        // Update dimensions based on which handle is being dragged
        switch (resizeHandle) {
          case 0: // Top-left
            newX = Math.min(ann.x + deltaX, ann.x + ann.width - 0.1);
            newY = Math.min(ann.y + deltaY, ann.y + ann.height - 0.1);
            newWidth = ann.width - deltaX;
            newHeight = ann.height - deltaY;
            break;
          case 1: // Top-middle
            newY = Math.min(ann.y + deltaY, ann.y + ann.height - 0.1);
            newHeight = ann.height - deltaY;
            break;
          case 2: // Top-right
            newY = Math.min(ann.y + deltaY, ann.y + ann.height - 0.1);
            newWidth = ann.width + deltaX;
            newHeight = ann.height - deltaY;
            break;
          case 3: // Middle-left
            newX = Math.min(ann.x + deltaX, ann.x + ann.width - 0.1);
            newWidth = ann.width - deltaX;
            break;
          case 4: // Middle-right
            newWidth = ann.width + deltaX;
            break;
          case 5: // Bottom-left
            newX = Math.min(ann.x + deltaX, ann.x + ann.width - 0.1);
            newWidth = ann.width - deltaX;
            newHeight = ann.height + deltaY;
            break;
          case 6: // Bottom-middle
            newHeight = ann.height + deltaY;
            break;
          case 7: // Bottom-right
            newWidth = ann.width + deltaX;
            newHeight = ann.height + deltaY;
            break;
        }

        // Ensure minimum size and keep within bounds
        newWidth = Math.max(0.1, Math.min(1 - newX, newWidth));
        newHeight = Math.max(0.1, Math.min(1 - newY, newHeight));

        return {
          ...ann,
          x: Math.max(0, newX),
          y: Math.max(0, newY),
          width: newWidth,
          height: newHeight
        };
      }

      return ann;
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragMode(null);
    setResizeHandle(null);
  };

  const handleAnnotationUpdate = (index: number, updates: Partial<DamageAnnotation>) => {
    setAnnotations(annotations.map((ann, i) => 
      i === index ? { ...ann, ...updates } : ann
    ));
  };

  const handleAddAnnotation = () => {
    const newAnnotation: DamageAnnotation = {
      type: 'square',
      x: 0.1,
      y: 0.1,
      width: 0.2,
      height: 0.2,
      confidence: 0.8,
      description: 'New damage area',
      severity: 'Medium',
      repairRecommendation: 'Please assess and provide recommendation',
      isAdjusted: true,
      adjustmentReason: 'Manually added annotation'
    };
    setAnnotations([...annotations, newAnnotation]);
    setSelectedAnnotation(annotations.length);
  };

  const handleDeleteAnnotation = (index: number) => {
    setAnnotations(annotations.filter((_, i) => i !== index));
    setSelectedAnnotation(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-7xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-[#002147]">Edit Image Annotations</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Canvas Side */}
          <div className="space-y-4">
            <canvas
              ref={canvasRef}
              width={dimensions.width}
              height={dimensions.height}
              className="border rounded-lg shadow-md w-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
            <button
              onClick={handleAddAnnotation}
              className="w-full bg-[#002147] text-white py-2 px-4 rounded-lg hover:bg-[#003167] transition-colors"
            >
              Add New Annotation
            </button>
          </div>

          {/* Controls Side */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#002147]">Annotations</h3>
            <div className="space-y-4">
              {annotations.map((annotation, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    index === selectedAnnotation
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <button
                      onClick={() => setSelectedAnnotation(index)}
                      className="text-[#002147] font-medium"
                    >
                      Damage Area {index + 1}
                    </button>
                    <button
                      onClick={() => handleDeleteAnnotation(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Type
                      </label>
                      <select
                        value={annotation.type}
                        onChange={(e) => handleAnnotationUpdate(index, { type: e.target.value as 'square' | 'circle' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002147] focus:ring-[#002147]"
                      >
                        <option value="square">Square</option>
                        <option value="circle">Circle</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Severity
                      </label>
                      <select
                        value={annotation.severity}
                        onChange={(e) => handleAnnotationUpdate(index, { severity: e.target.value as 'Low' | 'Medium' | 'High' | 'Critical' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002147] focus:ring-[#002147]"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={annotation.description}
                        onChange={(e) => handleAnnotationUpdate(index, { description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002147] focus:ring-[#002147]"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Repair Recommendation
                      </label>
                      <textarea
                        value={annotation.repairRecommendation}
                        onChange={(e) => handleAnnotationUpdate(index, { repairRecommendation: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#002147] focus:ring-[#002147]"
                        rows={2}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Confidence
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={annotation.confidence}
                        onChange={(e) => handleAnnotationUpdate(index, { confidence: parseFloat(e.target.value) })}
                        className="mt-1 block w-full"
                      />
                      <span className="text-sm text-gray-500">
                        {Math.round(annotation.confidence * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(annotations)}
            className="px-4 py-2 bg-[#002147] text-white rounded-lg hover:bg-[#003167] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}; 