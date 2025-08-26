"use client";

import React, { useEffect, useRef } from "react";
import mermaid from "mermaid";

export default function MermaidChart({ chart }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!chart || !ref.current) return;

    mermaid.initialize({
      startOnLoad: false,
      theme: "default",
      themeVariables: {
        fontSize: "18px", 
        nodeSpacing: 50, 
        rankSpacing: 50,
      },
    });

    const renderDiagram = async () => {
      try {
        const { svg } = await mermaid.render(`mermaid-${Date.now()}`, chart);
        if (ref.current) {
          ref.current.innerHTML = svg;
        }
      } catch (err) {
        console.error("Mermaid render error:", err);
        if (ref.current) {
          ref.current.innerHTML = `<pre style="color:red;">Invalid Mermaid diagram</pre>`;
        }
      }
    };

    renderDiagram();
  }, [chart]);

  return (
    <div
      ref={ref}
      className="w-full overflow-x-auto p-4 flex justify-center"
      style={{ maxHeight: "600px" }}
    />
  );
}
