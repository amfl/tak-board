console.log("Sup boi")// variable for the namespace 

//////////////////////////////////////
// CONFIGURABLE CONSTANTS
//////////////////////////////////////

const width = 80;
const height = 90;
const targets = 6;

//////////////////////////////////////
// SET UP THE SVG CANVAS
//////////////////////////////////////

const svgns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

const svg = document.querySelector("svg");

// figure the new svg width/height
const svgWidth = width * targets;
const svgHeight = height;


//////////////////////////////////////
// Create the basic shapes we will be transforming
//////////////////////////////////////

let baseRect = document.createElementNS(svgns, "rect");
baseRect.setAttribute("id", "baseRect");
baseRect.setAttribute("x", 0);
baseRect.setAttribute("y", 0);
baseRect.setAttribute("width", width);
baseRect.setAttribute("height", height);
baseRect.setAttribute("fill", "none");
baseRect.setAttribute("stroke", "black");

// gsap.set(baseRect, {
//           id: "baseRect",
//           x: 0,
//           y: 0,
//           width: 1,
//           height: 1,
//           fill: "none",
//           stroke: "black"
//       });

console.log(baseRect);

// Dynamically alter the svg
gsap.set(svg, {
    attr: {
          width: svgWidth,
          height: svgHeight,
          viewBox: "0 0 " + svgWidth + " " + svgHeight,
          style: "background-color: #333;"
    },
});

const defs = document.querySelector("defs");
defs.appendChild(baseRect);

//////////////////////////////////////
// Helper functions
//////////////////////////////////////

function addElement(name, x, y) {
    var g   = document.createElementNS(svgns, "g"),
        use = document.createElementNS(svgns, "use"),
        t   = 'translate(' + x + ',' + y + ') ' +
              'scale(' + 1 + ')';
    use.setAttributeNS(null, "class", name);
    use.setAttributeNS(xlinkns, "xlink:href", "#" + name);
    g.setAttributeNS(null, "transform", t);
    g.appendChild(use);
    return g
}

//////////////////////////////////////
// Draw the image by referencing and transforming the basic shapes
//////////////////////////////////////

for (let i = 0; i < targets; i++) {
    let newRect = addElement("baseRect", i*width, 0)
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
