// utils/renderCoverElements.ts
export const renderCoverElements = ({ texts = [], shapes = [], designs = [], images = [] }) => {
  const allElements = [...shapes, ...texts, ...designs, ...images].sort(
    (a, b) => a.zIndex - b.zIndex
  );

  return allElements.map((item) => {
    const commonStyle = {
      absolutePosition: { x: item.x, y: item.y },
      width: item.width,
      height: item.height,
      rotation: item.rotation,
    };

    if (item.text) {
      return {
        ...commonStyle,
        text: item.text,
        color: item.color,
        fontSize: item.fontSize || 14,
      };
    }

    if (item.type === "line") {
      return {
        canvas: [
          {
            type: "line",
            x1: 0,
            y1: 1,
            x2: item.width,
            y2: 1,
            lineWidth: 2,
            lineColor: item.color,
          },
        ],
        absolutePosition: { x: item.x, y: item.y },
      };
    }

    if (item.type === "triangle") {
      return {
        canvas: [
          {
            type: "polyline",
            points: [
              { x: item.width / 2, y: 0 },
              { x: 0, y: item.height },
              { x: item.width, y: item.height },
              { x: item.width / 2, y: 0 },
            ],
            closePath: true,
            color: item.color,
          },
        ],
        absolutePosition: { x: item.x, y: item.y },
      };
    }

    if (item.src) {
      return {
        ...commonStyle,
        image: item.src,
        fit: [item.width, item.height],
      };
    }

    if (item.type === "ascented") {
      return {
        stack: [
          {
            canvas: [
              { type: "rect", x: 0, y: 0, w: item.width, h: 4, color: item.accentColor },
              { type: "rect", x: 0, y: 4, w: item.width, h: item.height - 8, color: item.primaryColor },
              { type: "rect", x: 0, y: item.height - 4, w: item.width, h: 4, color: item.accentColor },
            ],
          },
        ],
        ...commonStyle,
      };
    }

    if (item.type === "footer") {
      return {
        stack: [
          {
            canvas: [
              { type: "rect", x: 0, y: 0, w: item.width, h: item.height - 4, color: item.primaryColor },
              { type: "rect", x: 0, y: item.height - 4, w: item.width, h: 4, color: item.accentColor },
            ],
          },
        ],
        ...commonStyle,
      };
    }

    if (item.primaryColor && item.accentColor) {
      return {
        canvas: [
          {
            type: "rect",
            x: 0,
            y: 0,
            w: item.width,
            h: item.height,
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: item.width,
              y2: 0,
              colorStops: [
                { offset: 0, color: item.primaryColor },
                { offset: 1, color: item.accentColor },
              ],
            },
          },
        ],
        ...commonStyle,
      };
    }

    return {
      canvas: [
        {
          type: "rect",
          x: 0,
          y: 0,
          w: item.width,
          h: item.height,
          color: item.color,
          r: item.type === "circle" ? item.width / 2 : 0,
        },
      ],
      ...commonStyle,
    };
  });
};
