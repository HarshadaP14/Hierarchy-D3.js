import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import "./TreeStyle.css";
const TreeVisualization = () => {
  const containerRef = useRef(null);
  const [svg, setSvg] = useState(null);

  useEffect(() => {
    const treeData = {
      name: "Start",
      children: [
        {
          name: "Research",
          children: [
            {
              name: "External",
              children: [
                {
                  name: "B2C",
                  children: [
                    { name: "Online" },
                    { name: "Personal Data" },
                    { name: "Interview" },
                    { name: "Help" },
                  ],
                },
                { name: "B2C" },
              ],
            },
            { name: "Internal" },
          ],
        },
        { name: "Planning", children: [{ name: "PRD" }, { name: "Specs" }] },
        {
          name: "Designing",
          children: [{ name: "Hardware" }, { name: "Software" }],
        },
        {
          name: "Manufacturing",
          children: [{ name: "Material" }, { name: "Production" }],
        },
        {
          name: "Sales/Marketing",
          children: [{ name: "Online" }, { name: "Dealership" }],
        },
      ],
    };

    const margin = { top: 50, right: 90, bottom: 30, left: 90 };
    const width = window.innerWidth - margin.left - margin.right;
    const height = window.innerHeight - margin.top - margin.bottom;

    const svgElement = d3
      .select(containerRef.current)
      .append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const treemap = d3.tree().size([height, width]);
    const root = d3.hierarchy(treeData);

    const nodes = treemap(root).descendants();
    const links = treemap(root).links();

    nodes.forEach(function (d) {
      d.y = d.depth * 180;
      if (d.children) {
        d.children.forEach(function (child) {
          child.y += d.children.length * 30;
        });
      }
    });

    const node = svgElement
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + d.y + "," + d.x + ")";
      });

    node
      .append("rect")
      .attr("x", -60)
      .attr("y", -10)
      .attr("width", 120)
      .attr("height", 20)
      .attr("rx", 10)
      .attr("ry", 10)
      .style("fill", "none")
      .style("stroke", "#1f77b4")
      .style("stroke-width", "4px");

    node
      .append("text")
      .attr("dy", ".35em")
      .attr("x", 0)
      .attr("y", 0)
      .style("text-anchor", "middle")
      .text(function (d) {
        return d.data.name;
      })

      .on("mouseover", showPopup)
      .on("mouseout", hidePopup);

    const link = svgElement
      .selectAll(".link")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("d", function (d) {
        return (
          "M" +
          d.source.y +
          "," +
          (d.source.x + 10) +
          "C" +
          (d.source.y + d.target.y) / 2 +
          "," +
          (d.source.x + 10) +
          " " +
          (d.source.y + d.target.y) / 2 +
          "," +
          (d.target.x + 10) +
          " " +
          d.target.y +
          "," +
          (d.target.x + 10)
        );
      })
      .style("fill", "none")
      .style("stroke", "#000")
      .style("stroke-width", "2px");

    setSvg(svgElement);

    return () => {
      svgElement.remove();
    };
  }, []);

  const showPopup = (event, d) => {
    const popup = document.getElementById("nodePopup");
    const popupContent = document.getElementById("popupContent");
    popupContent.innerHTML = `<strong>${d.data.name}</strong><br/>`;

    const data = [
      { label: "Positive", value: 20 },
      { label: "Negative", value: 10 },
      { label: "Comments", value: 30 },
    ];

    const totalComments = data.reduce((acc, cur) => acc + cur.value, 0);

    const svg = d3
      .select(popupContent)
      .append("svg")
      .attr("width", 240)
      .attr("height", 150);

    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .range([0, 150]);

    const yScale = d3
      .scaleBand()
      .domain(data.map((d) => d.label))
      .range([30, 100])
      .padding(0.1);

    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("x", 80)
      .attr("y", (d) => yScale(d.label))
      .attr("width", (d) => xScale(d.value))
      .attr("height", yScale.bandwidth())
      .attr("fill", (d, i) => (i === 0 ? "steelblue" : "red"));
    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", (d) => 45 + xScale(d.value))
      .attr("y", (d) => yScale(d.label) + yScale.bandwidth() / 2 + 20)
      .attr("dy", "0.35em")
      .attr("text-anchor", "end")
      .text((d) => d.value);
    svg
      .selectAll(".bar-label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "bar-label")
      .attr("x", -1)
      .attr("y", (d) => yScale(d.label) + 18)
      .attr("text-anchor", "start")
      .text((d) => d.label);

    popupContent.innerHTML += `<br/>Total Comments: ${totalComments}`;

    popup.style.display = "block";
    popup.style.left = event.pageX + "px";
    popup.style.top = event.pageY + "px";
  };

  // Function to hide the popup
  const hidePopup = () => {
    const popup = document.getElementById("nodePopup");
    popup.style.display = "none";
  };

  return (
    <div
      ref={containerRef}
      className="tree-container"
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
    >
      <div
        id="nodePopup"
        style={{
          display: "none",
          position: "absolute",
          backgroundColor: "white",
          border: "1px solid black",
          padding: "10px",
          zIndex: "9999",
          borderRadius: "5px",
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.1)",
          maxWidth: "80%",
          maxHeight: "80%",
          overflow: "auto",
        }}
      >
        <div style={{ marginBottom: "10px" }}></div>
        <div id="popupContent"></div>
      </div>
    </div>
  );
};

export default TreeVisualization;
