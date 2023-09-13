
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import "../App.css"
import { useSelector } from 'react-redux';

export default function BarChart({ data }) {
  const svgRef = useRef();
  const width = 600;
  const height = 500;
  const selectedColor = useSelector(state => state.theme.color);
  useEffect(() => {
    const svg = d3.select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);

    // Clear any existing content in the SVG element
    svg.selectAll('*').remove();

    // Define margin and inner dimensions
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Create scales for x and y axes
    const xScale = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([0, innerWidth])
      .padding(0.2);

    // Calculate the minimum value in your data
    const minValue = d3.min(data, d => d.value);

    // Calculate the maximum value in your data
    const maxValue = d3.max(data, d => d.value);
    // Define a minimum value for the y-axis as the lowest data value minus 2
    const gap = maxValue - minValue
    // Define a minimum value for the y-axis as the lowest data value minus 2
    const minYValue = minValue - (gap * 10 / 100)

    // Define a maximum value for the y-axis as the highest data value plus 2
    const maxYValue = maxValue + (gap * 10 / 100)


    const yScale = d3.scaleLinear()
      .domain([minYValue, maxYValue])
      .nice()
      .range([innerHeight, 0]);

    // Create axes
    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    // Create the group for the chart
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Render x-axis
    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(xAxis);

    // Render y-axis
    g.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    // Render bars
    g.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth())
      .attr('height', d => innerHeight - yScale(d.value));

  }, [data, width, height]);

  return (
    <div className='chart-container'>
      <svg fill={selectedColor} ref={svgRef} width={width} height={height} className="chart"></svg></div>
  );
};
