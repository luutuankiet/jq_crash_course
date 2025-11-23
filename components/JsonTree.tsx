import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface JsonTreeProps {
  data: any;
}

interface TreeNode {
  name: string;
  children?: TreeNode[];
  value?: string;
  type?: string;
}

const JsonTree: React.FC<JsonTreeProps> = ({ data }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Transform raw JSON to D3 hierarchy compatible format
  const transformData = (key: string, value: any): TreeNode => {
    if (value === null) return { name: key, value: "null", type: "null" };
    if (value === undefined) return { name: key, value: "undefined", type: "undefined" };
    
    if (Array.isArray(value)) {
      return {
        name: key,
        type: "array",
        children: value.map((item, index) => transformData(`[${index}]`, item))
      };
    }
    if (typeof value === 'object') {
      return {
        name: key,
        type: "object",
        children: Object.entries(value).map(([k, v]) => transformData(k, v))
      };
    }
    return { name: key, value: String(value), type: typeof value };
  };

  useEffect(() => {
    if (!data || !svgRef.current || !containerRef.current) {
        // Clear if data is invalid
        if(svgRef.current) d3.select(svgRef.current).selectAll("*").remove();
        return;
    }

    const treeData = transformData("root", data);
    const width = containerRef.current.clientWidth;
    const height = 600;

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(60,0)"); // Shift right slightly

    const root = d3.hierarchy(treeData);
    const treeLayout = d3.tree<TreeNode>().size([height - 50, width - 200]);
    treeLayout(root);

    // Links
    svg.selectAll('.link')
      .data(root.links())
      .enter()
      .append('path')
      .attr('class', 'link')
      .attr('fill', 'none')
      .attr('stroke', '#475569') // slate-600
      .attr('stroke-width', 1.5)
      .attr('d', d3.linkHorizontal()
        .x((d: any) => d.y)
        .y((d: any) => d.x) as any
      );

    // Nodes
    const nodes = svg.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .attr('class', 'node')
      .attr('transform', (d: any) => `translate(${d.y},${d.x})`);

    // Circles
    nodes.append('circle')
      .attr('r', 6)
      .attr('fill', (d) => {
        if (d.data.type === 'object') return '#f59e0b'; // amber
        if (d.data.type === 'array') return '#3b82f6'; // blue
        return '#10b981'; // green for leaf
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', 1);

    // Labels
    nodes.append('text')
      .attr('dy', (d) => d.children ? -10 : 4)
      .attr('dx', (d) => d.children ? 0 : 10)
      .attr('text-anchor', (d) => d.children ? 'middle' : 'start')
      .text((d) => {
        const val = d.data.value ? `: ${d.data.value}` : '';
        return `${d.data.name}${val}`;
      })
      .style('font-size', '12px')
      .style('fill', '#e2e8f0') // slate-200
      .style('font-family', 'monospace');

  }, [data]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-auto bg-slate-900 rounded-lg border border-slate-700 shadow-inner">
       <div className="p-2 text-xs text-slate-400 absolute">D3 Visualization: Object Structure</div>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default JsonTree;