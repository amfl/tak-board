console.log("Sup boi")// variable for the namespace 

//////////////////////////////////////
// CONFIGURABLE CONSTANTS
//////////////////////////////////////

const squareWidth = 100; // Width of a "square", not including any separation
const numSquares = 5; // Defines the dimensions of the entire board
const diamondRadius = 20;
const separation = 8;

//////////////////////////////////////
// SET UP THE SVG CANVAS
//////////////////////////////////////

const svgns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

const svg = document.querySelector("svg");

// figure the new svg width/height
const svgWidth = diamondRadius*2 + squareWidth*numSquares;
const svgHeight = svgWidth;

//////////////////////////////////////
// Create the basic shapes we will be transforming
//////////////////////////////////////

let baseOct = document.createElementNS(svgns, "polygon");
const a = (squareWidth/2) - diamondRadius - separation;
const w = (squareWidth - separation)/2;
const octPoints = "-a,w a,w w,a w,-a a,-w -a,-w -w,-a -w,a".replaceAll("a", a).replaceAll("w", w)
baseOct.setAttribute("points", octPoints);
baseOct.setAttribute("id", "baseOct");
baseOct.setAttribute("fill", "none");
baseOct.setAttribute("stroke", "black");

let baseDia = document.createElementNS(svgns, "polygon");
baseDia.setAttribute("id", "baseDia");
const diamondPoints = "-r,0 0,r r,0 0,-r".replaceAll("r", diamondRadius);
baseDia.setAttribute("points", diamondPoints);
baseDia.setAttribute("fill", "none");
baseDia.setAttribute("stroke", "black");

console.log(baseOct);

// Dynamically alter the svg
gsap.set(svg, {
    attr: {
          width: svgWidth,
          height: svgHeight,
          viewBox: "0 0 " + svgWidth + " " + svgHeight
          // style: "background-color: #333;"
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

for (let j = 0; j <= numSquares; j++) {
    for (let i = 0; i <= numSquares; i++) {
        let newDia = addElement(
            "baseDia",
            diamondRadius + i*squareWidth,
            diamondRadius + j*squareWidth
        )
        svg.appendChild(newDia);

        if (i < numSquares && j < numSquares) {
            let newOct = addElement(
                "baseOct",
                diamondRadius + squareWidth/2 + i*squareWidth,
                diamondRadius + squareWidth/2 + j*squareWidth
            )
            svg.appendChild(newOct);
        }
    }
}
