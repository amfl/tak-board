//////////////////////////////////////
// CONFIGURABLE CONSTANTS
//////////////////////////////////////

const squareWidth = 100;   // Width of a "square", not including any separation
const numSquares = 4;      // Defines the dimensions of the entire board
const diamondRadius = 20;  // How wide the diamonds are
const separation = 8;      // Separation between diamonds and octagons

const cardDimensionsMm = [57, 88]
const a4DimensionsMm = [210, 297]

//////////////////////////////////////
// SET UP THE SVG CANVAS
//////////////////////////////////////

// Namespaces for the SVG spec
// We need to refer to these when adding elements to the SVG so the browser
// knows what we're talking about
const svgns = "http://www.w3.org/2000/svg";
const xlinkns = "http://www.w3.org/1999/xlink";

const svg = document.querySelector("svg");

// Dynamically alter the svg canvas size on-screen and on-paper
svg.setAttribute("width", a4DimensionsMm[0] + "mm");
svg.setAttribute("height", a4DimensionsMm[1] + "mm");

// Alter the viewport so the browser can see the whole thing
svg.setAttribute("viewBox", "0 0 " + a4DimensionsMm[0] + " " + a4DimensionsMm[1]);

//////////////////////////////////////
// Create the basic shapes we will be transforming
//////////////////////////////////////

// BASE CARD
let baseCard = document.createElementNS(svgns, "rect");
baseCard.setAttribute("id", "baseCard");
baseCard.setAttribute("width", cardDimensionsMm[0]);
baseCard.setAttribute("height", cardDimensionsMm[1]);
baseCard.setAttribute("fill", "none");
baseCard.setAttribute("stroke", "lightgrey");
baseCard.setAttribute("stroke-width", "0.5");

// Append these basic shapes into the SVG defs section so we can refer to them later.
const defs = document.querySelector("defs");
defs.appendChild(baseCard);

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
// Draw the board by referencing and transforming the basic shapes
//////////////////////////////////////

function main() {
    // TODO: Have some generator which produces card transformations to fit
    // them on a page.
    for (let j = 0; j <= 2; j++) {
        for (let i = 0; i <= 3; i++) {

            // Drop a diamond at each corner
            let newCard = createElement(
                "baseCard",
                i*cardDimensionsMm[0],
                j*cardDimensionsMm[1]
            )
            svg.appendChild(newCard);
        }
    }
}

main();
