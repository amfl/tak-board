console.log("Sup boi")// variable for the namespace 

const svgns = "http://www.w3.org/2000/svg";
// make a simple rectangle
let newRect = document.createElementNS(svgns, "rect");;

// newRect.setAttribute("x", "150");
// newRect.setAttribute("y", "150");
// newRect.setAttribute("width", "100");
// newRect.setAttribute("height", "100");
// newRect.setAttribute("fill", "#5cceee");

// set attributes of new rectangle
gsap.set(newRect, {
  attr: { x: 150, y: 150, width: 100, height: 100, fill: "#5cceee" }
});

// targeting the svg itself
const svg = document.querySelector("svg");
// append the new rectangle to the svg
svg.appendChild(newRect);
