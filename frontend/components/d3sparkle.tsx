"use client"
import { useRef, useEffect } from "react"
import * as d3 from "d3"

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  id: string
}

export function D3Sparkline({ data, width = 150, height = 30, color = "#10b981", id }: SparklineProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return

    // Clear any existing elements
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current)

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([0, Math.max(...data) * 1.1]) // Add 10% padding at the top
      .range([height, 0])

    // Create line generator with sharp edges
    const line = d3
      .line<number>()
      .x((d, i) => xScale(i))
      .y((d) => yScale(d))
      .curve(d3.curveLinear) // Use linear for sharp edges

    // Create path
    svg.append("path").datum(data).attr("fill", "none").attr("stroke", color).attr("stroke-width", 1.5).attr("d", line)

    // Optional: Add a subtle area fill
    const area = d3
      .area<number>()
      .x((d, i) => xScale(i))
      .y0(height)
      .y1((d) => yScale(d))
      .curve(d3.curveLinear)

    // Add gradient definition
    const gradient = svg
      .append("defs")
      .append("linearGradient")
      .attr("id", `sparkline-gradient-${id}`)
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%")

    gradient.append("stop").attr("offset", "0%").attr("stop-color", color).attr("stop-opacity", 0.3)

    gradient.append("stop").attr("offset", "100%").attr("stop-color", color).attr("stop-opacity", 0)

    // Add area with very subtle fill
    svg.append("path").datum(data).attr("fill", `url(#sparkline-gradient-${id})`).attr("d", area)
  }, [data, width, height, color, id])

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className="overflow-visible"
    />
  )
}
