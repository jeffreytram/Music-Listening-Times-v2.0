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

const defaultRadius = 3;
const mediumRadius = 5;
const largeRadius = 7;

const defaultOpacity = .3;
const mediumOpacity = .5;
const highOpacity = .7;
const hiddenOpacity = .05;

const dict = [
  ['none', [defaultOpacity, defaultRadius]],
  ['day', [defaultOpacity, defaultRadius]],
  ['search', [mediumOpacity, mediumRadius]],
  ['select', [highOpacity, largeRadius]],
]

const circleSettings = new Map(dict);

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
  }

  /**
   * Draws the graph with new data (month change)
   */
  drawGraph = () => {
    // OTHER INITIALIZATION
    const { data, setClickedPoint, setFilteredDatasetMonth, sampleDate } = this.props;

    // TODO: need to improve this
    // initial state, loading icon
    // empty state for when no data
    // if (data) {
    const dateInMonth = sampleDate;
    const yState = generateYState(dateInMonth);

    //y-axis scale
    const yScale = d3.scaleTime()
      .domain(yState)
      .range([padding.top, height - padding.down]);

    //x-axis line
    var xAxis = d3.axisBottom(xScale)
      .ticks(d3.timeHour.every(2))
      .tickFormat(d3.timeFormat('%H:%M'));

    //y-axis line
    var yAxis = d3.axisLeft(yScale)

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
    var point = svg.selectAll('.point')
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

    //add circle to group
    pointEnter.append('circle')
      .attr('r', defaultRadius)
      .style('opacity', defaultOpacity)
      .on("click", function (e, d) {
        setClickedPoint(d);
        setFilteredDatasetMonth([d]);
        // TODO: when clicked, need to update graph so only the selected point is viewed
        // need to pass a filteredDatasetMonth setter to this component so we can set the filtereddataset to
        // an array with only 1 point, the selected point.

        // clearDayFilters();
        // displaySongInfo(d);
        // displayTags(d);
        // clearHighlight();
        // singleHighlight(d3.select(this));
      });

    //remove filtered out circles
    point.exit().remove();

    this.drawCanvasBars(inputData);
  }

  /**
   * Updates the current data in the graph (same month, no month change. filter update)
   */
  updateGraph = () => {
    const { filteredData, filterView } = this.props;

    //filtered selection
    var point = svg.selectAll('.point')
      .data(filteredData, d => d.ConvertedDateTime);

    const opacity = circleSettings.get(filterView)[0];
    const radius = circleSettings.get(filterView)[1];

    point.select("circle")
      .attr('r', radius)
      .style('opacity', opacity);

    //remove filtered out circles
    point.exit()
      .select("circle")
      .attr('r', defaultRadius)
      .style('opacity', hiddenOpacity);

    this.drawCanvasBars(filteredData);
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
      context.fillStyle = `rgba(${rgb}, .1)`;
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