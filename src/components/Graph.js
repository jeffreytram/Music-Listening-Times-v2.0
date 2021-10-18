import React from 'react';
import * as d3 from "d3";
import { generateYState } from '../logic/chart';

const width = 950;
const height = 540;
const padding = { left: 90, right: 40, top: 10, down: 60 };

let svg = {};
let canvas = {};

let xAxisG = {};
let yAxisG = {};

let xScale = {};
let yScale = {};

let clipGroup = {};
let pointGroup = {};

let zoom = {};

// opacity, radius
const monthlySettings = [
  ['none', [.3, 3]],
  ['day', [.3, 3]],
  ['search', [.5, 5]],
  ['select', [.7, 7]],
  ['hidden', [.05, 3]],
]

const yearlySettings = [
  ['none', [.3, 2]],
  ['day', [.3, 2]],
  ['search', [.4, 3]],
  ['select', [.7, 7]],
  ['hidden', [.03, 2]],
]

const monthlyCircleSettings = new Map(monthlySettings);
const yearlyCircleSettings = new Map(yearlySettings);

export default class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    this.initializeGraph();
  }

  componentDidUpdate() {
    const { newLoad } = this.props;
    if (newLoad) {
      // brand new month data load
      this.drawGraph();
    } else {
      // updating the current month data with a filter/reset
      this.updateGraph();
    }
  }

  /**
   * Initializes the graph for the first time application load
   */
  initializeGraph = () => {
    // GENERATE ELEMENTS 
    //Where to add the graph to
    svg = d3.select('#main-graph')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .classed('svg-content', true);

    canvas = d3.select('#canvas')
      .attr('width', width)
      .attr('height', 45);

    //append x-axis
    xAxisG = svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height - padding.down})`);

    //append y-axis
    yAxisG = svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', `translate(${padding.left}, 0)`);

    const startDay = new Date();
    startDay.setHours(0, 0, 0, 0);
    const endDay = new Date();
    endDay.setHours(23, 59, 59, 59);

    // x-axis scaled - time from 00:00 - 23:59:59
    xScale = d3.scaleTime()
      .domain([startDay, endDay])
      .range([padding.left, width - padding.right]);

    yScale = d3.scaleTime()
      .range([padding.top, height - padding.down]);

    //cursor position vertical line
    let line = svg.append('path')
      .style('stroke', 'var(--secondary-color')
      .style('stroke-width', '3px')
      .style('stroke-dasharray', '4');

    svg
      .on('mousemove', function (event) {
        let mouse = d3.pointer(event);
        line.attr('d', function () {
          //d = 'M100,0 L100,460
          //move to 100,460 then line to 100,0
          let d = 'M' + mouse[0] + ',0 ';
          d += 'L' + mouse[0] + `,${height - padding.down}`;
          return d;
        });
      })
      .on('mouseover', function () {
        line.style('opacity', .4)
      })
      .on('mouseout', function () {
        line.style('opacity', 0);
      });

    //append x-axis label
    svg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${(padding.left + width - padding.right) / 2}, ${height - padding.down / 4})`)
      .text('Time of Day (hrs:mins)');

    //append y-axis label
    svg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${padding.left / 4}, ${(padding.top + height - padding.down) / 2}) rotate(-90)`)
      .text('Date');

    // point group
    clipGroup = svg.append('g')
      .attr("clip-path", "url(#clip)");
    pointGroup = clipGroup.append('g');

    // Add a clipPath: everything out of this area won't be drawn.
    var clip = svg.append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width - padding.left - padding.right)
      .attr("height", height - padding.top - padding.down + 14)
      .attr("x", padding.left)
      .attr("y", padding.top - 7);

    zoom = d3.zoom()
      .scaleExtent([1, 16])
      .extent([[padding.left, padding.top], [width - padding.right, height - padding.down]])
      .translateExtent([[padding.left, padding.top], [width - padding.right, height - padding.down]]);

    svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
  }

  // A function that updates the chart when the user zoom and thus new boundaries are available
  zoomed = ({ transform }, defaultRadius) => {
    // recover the new scale
    const zx = transform.rescaleX(xScale).interpolate(d3.interpolateRound);
    const zy = transform.rescaleY(yScale).interpolate(d3.interpolateRound);

    // update circle position
    pointGroup.attr('transform', transform);

    const xAxis = d3.axisBottom(zx)
      .ticks(d3.timeHour.every(1))
      .tickFormat(d3.timeFormat('%H:%M'));

    const yAxis = d3.axisLeft(zy);

    xAxisG.call(xAxis);
    yAxisG.call(yAxis);
  }

  /**
   * Draws the graph with new data (month change)
   */
  drawGraph = () => {
    // OTHER INITIALIZATION
    const { data, setClickedPoint, setFilteredDataset, sampleDate, timePeriod } = this.props;

    // TODO: need to improve this
    // initial state, loading icon
    // empty state for when no data
    // if (data) {
    const dateInMonth = sampleDate;
    const yState = generateYState(dateInMonth, timePeriod);

    //y-axis scale    
    yScale.domain(yState);

    //x-axis line
    var xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeHour.every(1))
      .tickFormat(d3.timeFormat('%H:%M'));

    //y-axis line
    var yAxis = d3.axisLeft(yScale);

    xAxisG.call(xAxis);
    yAxisG.call(yAxis);

    const inputData = (data) ? data : [];
    // clear 'no data message'
    svg.select('.no-data-message').remove();
    if (inputData.length === 0) {
      // genereate 'no data' text
      //append x-axis label
      svg.append('text')
        .attr('class', 'no-data-message')
        .attr('text-anchor', 'middle')
        .attr('transform', `translate(${(padding.left + width - padding.right) / 2}, ${(height - padding.down - padding.top) / 2})`)
        .text(`No data for ${sampleDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`);
    }

    // RENDER CIRCLES
    //filtered selection

    var point = pointGroup.selectAll('.point')
      .data(inputData, d => d.ConvertedDateTime);

    var pointEnter = point.enter()
      .append('g')
      .attr('class', 'point');

    pointEnter.merge(point)
      .attr('transform', d => {
        var tx = xScale(d.Time);
        var ty = yScale(d.Date);
        return 'translate(' + [tx, ty] + ')';
      });

    const circleSettings = (timePeriod === 'monthly') ? monthlyCircleSettings : yearlyCircleSettings;

    const opacity = circleSettings.get('none')[0];
    const radius = circleSettings.get('none')[1];

    //add circle to group
    pointEnter.append('circle')
      .attr('r', radius)
      .style('opacity', opacity)
      .on("click", function (e, d) {
        setClickedPoint(d.ID);
        setFilteredDataset([d], 'select');
      });

    //remove filtered out circles
    point.exit().remove();

    this.drawCanvasBars(inputData);

    zoom.on("zoom", (event) => this.zoomed(event, radius));
  }

  /**
   * Updates the current data in the graph (same month, no month change. filter update)
   */
  updateGraph = () => {
    const { filteredData, filterView, timePeriod } = this.props;

    const circleSettings = (timePeriod === 'monthly') ? monthlyCircleSettings : yearlyCircleSettings;

    const opacity = circleSettings.get(filterView)[0];
    const radius = circleSettings.get(filterView)[1];
    const hiddenOpacity = circleSettings.get('hidden')[0];
    const hiddenRadius = circleSettings.get('hidden')[1];
    const defaultRadius = circleSettings.get('none')[1];


    //filtered selection
    var point = pointGroup.selectAll('.point')
      .data(filteredData, d => d.ConvertedDateTime);

    point.select("circle")
      .attr('r', radius)
      .style('opacity', opacity);

    //remove filtered out circles
    point.exit()
      .select("circle")
      .attr('r', hiddenRadius)
      .style('opacity', hiddenOpacity);

    this.drawCanvasBars(filteredData);

    zoom.on("zoom", (event) => this.zoomed(event, defaultRadius));
  }

  /**
   * Draws the vertical bars on the single axis time graph
   * @param {Array} data The data to use for the graph
   */
  drawCanvasBars = (data) => {
    const cWidth = canvas.node().width;
    const cHeight = canvas.node().height;

    //object with prop and methods used to render graphics in canvas element
    let context = canvas.node().getContext('2d');

    // clear canvas
    context.clearRect(0, 0, cWidth, cHeight);

    const style = getComputedStyle(document.body);
    const rgb = style.getPropertyValue('--default-rgb');

    for (let i = 0; i < data.length; i++) {
      let d = data[i];

      //draw rect
      context.fillStyle = `rgba(${rgb}, .01)`;
      context.fillRect(xScale(d.Time), 0, 3, cHeight);
    }
  }

  render() {
    return <div>
      <canvas id="canvas"></canvas>
      <svg id="main-graph"></svg>
    </div>
  }
}