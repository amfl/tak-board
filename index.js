console.log("Sup boi")// variable for the namespace 

const svgns = "http://www.w3.org/2000/svg";

// change any value
let width = 80;
let height = 90;
let targets = 6;

// targeting the svg itself
const svg = document.querySelector("svg");
// figure the new svg width/height
const svgWidth = width * targets;
const svgHeight = height;

// Dynamically alter the svg
gsap.set(svg, {
    attr: {
          width: svgWidth,
          height: svgHeight,
          viewBox: "0 0 " + svgWidth + " " + svgHeight,
          style: "background-color: #333;"
    }
});

for (let i = 0; i < targets; i++) {
    let newRect = document.createElementNS(svgns, "rect");
    gsap.set(newRect, {
              x: i * width,
              y: 0,
              width: width * 0.9,
              height: height * 0.9,
              // fill: "#5cceee",
              fill: "none",
              stroke: "black"
          });
    svg.appendChild(newRect);
}

// // make a simple rectangle
// let newRect = document.createElementNS(svgns, "rect");;
// // set attributes of new rectangle
// gsap.set(newRect, {
//   attr: { x: 150, y: 150, width: 100, height: 100, fill: "#5cceee" }
// });

// append the new rectangle to the svg
// svg.appendChild(newRect);
