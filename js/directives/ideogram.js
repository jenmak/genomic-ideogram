/**
 * Created by jennifermak on 2/12/16.
 */
var angular = require('angular');
angular.module('app')
    .directive('ideogram', function ($window) {
        return {
            restrict: "EA",
            scope: {
                bandsData: '='
            },
            link: function (scope, elem, attr) {
                var xScale, yScale,colorScale, min,max,centr;
                var d3 = $window.d3,
                    svg = d3.select(elem.find('svg')[0]),
                    width = 1000,
                    height = 200,
                    container = d3.select(svg.node().parentNode);

                function setChartParameters() {

                    min = d3.min(scope.bandsData, function (d) {
                        return d['genomic_coordinates']['start'];
                    });

                    max = d3.max(scope.bandsData, function (d) {
                        return d['genomic_coordinates']['stop'];
                    });

                    centr = d3.min(scope.bandsData, function (d) {
                        if(d.arm == 'q')
                        return d['genomic_coordinates']['start'];
                    });

                    xScale = d3.scale.linear()
                        .domain([min, max])
                        .range([0, width]);

                    yScale = d3.scale.linear()
                        .domain([0, 100])
                        .range([0,height]);

                    colorScale = d3.scale.linear()
                        .domain([0, 100])
                        .range(['white','purple']);
                }

                function isLeftRoundedRect(d) {
                    if(d.genomic_coordinates.start == min || d.genomic_coordinates.start == centr)
                        return true;
                    return false;
                }

                function leftRoundedRect(x, y, width, height, radius) { // top right
                    return "M" + x + "," + y
                        + "h" + (radius - width)
                        + "a" + -radius + "," + radius + " 0 0 0 " + -radius + "," + radius
                        + "v" + (height - 2 * radius)
                        + "a" + radius + "," + radius + " 0 0 0 " + radius + "," + radius
                        + "h" + (width - radius)
                        + "z";
                }

                function isRightRoundedRect(d) {
                    if(d.genomic_coordinates.stop == max || d.genomic_coordinates.stop == centr)
                        return true;
                    return false;
                }

                function rightRoundedRect(x, y, width, height, radius) {
                    return "M" + x + "," + y // top left
                        + "h" + (width - radius)
                        + "a" + radius + "," + radius + " 0 0 1 " + radius + "," + radius
                        + "v" + (height - 2 * radius)
                        + "a" + radius + "," + radius + " 0 0 1 " + -radius + "," + radius
                        + "h" + (radius - width)
                        + "z";
                }

                function rect(x,y,width,height) {
                    return "M" + x + "," + y
                        + "h" + width
                        + "v" + height
                        + "h" + -width
                        + "z";
                }

                function responsify() {
                    var aspect = width / height;

                    svg.attr('viewBox', '0 0 ' + width + ' ' + height)
                        .attr('preserveAspectRatio', 'xMinYMid')
                        .call(resize);

                    function resize () {
                        var targetWidth = parseInt(container.style('width'));
                        svg.attr('width', targetWidth);
                        svg.attr('height', Math.round(targetWidth / aspect));
                    }
                }

                // Redraw chart when bandsData changes.

                scope.$watch("bandsData", function() {
                    redrawChart();
                });

                function redrawChart() {
                    svg.attr('style', null)
                    svg.selectAll('path').remove();
                    drawChart();
                    resizeSVG($window.innerWidth);
                }
                // Resize svg when window resizes.

                angular.element($window).bind('resize', function() {
                    resizeSVG($window.innerWidth);
                    scope.$apply();
                });

                function resizeSVG(w) {
                    if($window.innerWidth < 1000) {
                        svg.style('width', w *.9);
                    } else {
                        svg.style('width',900);
                    }
                }

                function drawChart() {

                    setChartParameters();

                    svg.selectAll("path")
                        .data(scope.bandsData)
                        .enter()
                        .append('path')
                        .each(function(d) {
                            if(isRightRoundedRect(d)) { // top left
                                d3.select(this).attr({
                                    d: rightRoundedRect(xScale(d.genomic_coordinates.start), 50, xScale(d.genomic_coordinates.stop - d.genomic_coordinates.start), 25, 8)
                                });
                            }
                            else if(isLeftRoundedRect(d)) { // top right
                                d3.select(this).attr({
                                    d: leftRoundedRect(xScale(d.genomic_coordinates.stop), 50, xScale(d.genomic_coordinates.stop - d.genomic_coordinates.start), 25, 8)
                                });
                            } else {
                                d3.select(this).attr({
                                    d: rect(xScale(d.genomic_coordinates.start), 50, xScale(d.genomic_coordinates.stop - d.genomic_coordinates.start), 25)
                                })
                            }
                        })
                        .attr({
                            fill:function(d) { return colorScale(d.density); }
                        })
                        .on("mouseover", function(d,i) {
                            d3.select('text')
                                .attr({
                                    x: xScale(d.genomic_coordinates.stop - (d.genomic_coordinates.stop - d.genomic_coordinates.start)/2),
                                    y:yScale(60)
                                })
                                .text(d.band_label);
                            d3.select("#tooltip").classed("show", true);
                        })
                        .on("mouseout", function() {
                            d3.select("#tooltip").classed("show", false);
                        })
                        .call(responsify);
                }

            },
            template: "<svg width='1000' height='200'><text id='tooltip'></text></svg>"
        }
    });