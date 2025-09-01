"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chart }) {
  const ref = useRef(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!chart || !ref.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      themeVariables: {
        fontSize: "24px",
        nodeSpacing: 120,
        rankSpacing: 120,
      },
    });

    const renderDiagram = async () => {
      try {
        mermaid.parse(chart);

        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        if (ref.current) {
          ref.current.innerHTML = svg;
          setIsValid(true);
        }
      } catch (err) {
        console.error("Mermaid validation/render error:", err);
        setIsValid(false); 
      }
    };

    renderDiagram();
  }, [chart]);

  if (!isValid) return null;

  return (
    <div
      ref={ref}
      className="w-full overflow-x-auto p-4 flex justify-center"
      style={{ maxHeight: "600px" }}
    />
  );
}
