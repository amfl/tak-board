console.log("Sup boi")// variable for the namespace 

//////////////////////////////////////
// CONFIGURABLE CONSTANTS
//////////////////////////////////////

const octagonWidth = 100;
const diamondWidth = 26;
const separation = 10;
const numDiamonds = 6;

//////////////////////////////////////
// SET UP THE SVG CANVAS
//////////////////////////////////////

const svgns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

const svg = document.querySelector("svg");

// figure the new svg width/height
const svgWidth = diamondWidth*2 + (octagonWidth + separation) * (numDiamonds-1);
const svgHeight = svgWidth;

//////////////////////////////////////
// Create the basic shapes we will be transforming
//////////////////////////////////////

// let baseOct = document.createElementNS(svgns, "rect");
// baseOct.setAttribute("id", "baseOct");
// baseOct.setAttribute("x", 0);
// baseOct.setAttribute("y", 0);
// baseOct.setAttribute("width", octagonWidth);
// baseOct.setAttribute("height", octagonWidth);
// baseOct.setAttribute("fill", "none");
// baseOct.setAttribute("stroke", "black");

let baseOct = document.createElementNS(svgns, "polygon");
const a = diamondWidth * Math.SQRT1_2; // Tbh I guessed this... It's probably right
const w = octagonWidth/2;
const path = "-a,w a,w w,a w,-a a,-w -a,-w -w,-a -w,a".replaceAll("a", a).replaceAll("w", w)
baseOct.setAttribute("points", path);
baseOct.setAttribute("id", "baseOct");
baseOct.setAttribute("fill", "none");
baseOct.setAttribute("stroke", "black");

let baseDia = document.createElementNS(svgns, "polygon");
baseDia.setAttribute("id", "baseDia");
baseDia.setAttribute("points", "-" + diamondWidth + ",0 0," + diamondWidth + " " + diamondWidth +",0 0,-" + diamondWidth);
baseDia.setAttribute("fill", "none");
baseDia.setAttribute("stroke", "black");

// gsap.set(baseOct, {
//           id: "baseOct",
//           x: 0,
//           y: 0,
//           width: 1,
//           height: 1,
//           fill: "none",
//           stroke: "black"
//       });

console.log(baseOct);

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
defs.appendChild(baseOct);
defs.appendChild(baseDia);

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

const s = separation / 2;

for (let j = 0; j < numDiamonds; j++) {
    for (let i = 0; i < numDiamonds; i++) {
        let newDia = addElement(
            "baseDia",
            diamondWidth + i*(octagonWidth + separation),
            diamondWidth + j*(octagonWidth + separation)
        )
        svg.appendChild(newDia);

        if (i+1 < numDiamonds && j+1 < numDiamonds) {
            let newOct = addElement(
                "baseOct",
                diamondWidth + s + octagonWidth/2 + i*(octagonWidth + separation),
                diamondWidth + s + octagonWidth/2 + j*(octagonWidth + separation)
            )
            svg.appendChild(newOct);
        }
    }
}

// // make a simple rectangle
// let newRect = document.createElementNS(svgns, "rect");;
// // set attributes of new rectangle
// gsap.set(newRect, {
//   attr: { x: 150, y: 150, width: 100, height: 100, fill: "#5cceee" }
// });

// append the new rectangle to the svg
// svg.appendChild(newRect);
