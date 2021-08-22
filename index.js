//////////////////////////////////////
// CONFIGURABLE CONSTANTS
//////////////////////////////////////

const squareWidth = 100;   // Width of a "square", not including any separation
const numSquares = 4;      // Defines the dimensions of the entire board
const diamondRadius = 20;  // How wide the diamonds are
const separation = 8;      // Separation between diamonds and octagons

//////////////////////////////////////
// SET UP THE SVG CANVAS
//////////////////////////////////////

// Namespaces for the SVG spec
// We need to refer to these when adding elements to the SVG so the browser
// knows what we're talking about
const svgns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

const svg = document.querySelector("svg");

// Complete SVG will be the size of all the squares,
// plus half a diamond on each side.
const svgDimensions = diamondRadius*2 + squareWidth*numSquares;

// Dynamically alter the svg canvas size on-screen and on-paper
// svg.setAttribute("width", svgDimensions);
// svg.setAttribute("height", svgDimensions);

// Alter the viewport so the browser can see the whole thing
svg.setAttribute("viewBox", "0 0 " + svgDimensions + " " + svgDimensions);

//////////////////////////////////////
// Create the basic shapes we will be transforming
//////////////////////////////////////

// BASE OCTOGON
let baseOct = document.createElementNS(svgns, "polygon");
const a = (squareWidth/2) - diamondRadius - separation;  // Half length of horizontal/vertical sides
const w = (squareWidth - separation)/2;                  // Half maximum bounding box of octogon
const octPoints = "-a,w a,w w,a w,-a a,-w -a,-w -w,-a -w,a".replaceAll("a", a).replaceAll("w", w)
baseOct.setAttribute("points", octPoints);
baseOct.setAttribute("id", "baseOct");
baseOct.setAttribute("fill", "none");
baseOct.setAttribute("stroke", "black");

// BASE DIAMOND
let baseDia = document.createElementNS(svgns, "polygon");
baseDia.setAttribute("id", "baseDia");
const diamondPoints = "-r,0 0,r r,0 0,-r".replaceAll("r", diamondRadius);
baseDia.setAttribute("points", diamondPoints);
baseDia.setAttribute("fill", "none");
baseDia.setAttribute("stroke", "black");

// Append these basic shapes into the SVG defs section so we can refer to them later.
const defs = document.querySelector("defs");
defs.appendChild(baseOct);
defs.appendChild(baseDia);

//////////////////////////////////////
// Helper functions
//////////////////////////////////////

/**
 * Create an element with its own transform group so we can move it around on
 * the svg.
 */
function createElement(name, x, y) {
    var g   = document.createElementNS(svgns, "g"),
        use = document.createElementNS(svgns, "use"),
        t   = 'translate(' + x + ',' + y + ') ' +
              'scale(' + 1 + ')';
    use.setAttributeNS(null, "class", name);
    // Refer to one of the base shapes we made earlier
    use.setAttributeNS(xlinkns, "xlink:href", "#" + name);
    g.setAttributeNS(null, "transform", t);
    g.appendChild(use);
    return g
}

//////////////////////////////////////
// Aruco Stuff
//////////////////////////////////////

function populateAruco() {
    let marker = new ArucoMarker(123);
    let marker_div = document.getElementById("marker");
    marker_div.innerHTML = marker.toSVG();
    console.log("Done with aruco");
}

function main() {
    // Draw the board by referencing and transforming the basic shapes
    for (let j = 0; j <= numSquares; j++) {
        for (let i = 0; i <= numSquares; i++) {

            // Drop a diamond at each corner
            let newDia = createElement(
                "baseDia",
                diamondRadius + i*squareWidth,
                diamondRadius + j*squareWidth
            )
            svg.appendChild(newDia);

            // Draw an octogon if we're not at the very edge of the board
            if (i < numSquares && j < numSquares) {
                let newOct = createElement(
                    "baseOct",
                    diamondRadius + squareWidth/2 + i*squareWidth,
                    diamondRadius + squareWidth/2 + j*squareWidth
                )
                svg.appendChild(newOct);
            }
        }
    }

    // Slap an aruco marker on there
    populateAruco();
}

main();
