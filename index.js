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
function createElement(name, transform) {
    var g   = document.createElementNS(svgns, "g"),
        use = document.createElementNS(svgns, "use");
    use.setAttributeNS(null, "class", name);
    // Refer to one of the base shapes we made earlier
    use.setAttributeNS(xlinkns, "xlink:href", "#" + name);
    g.setAttributeNS(null, "transform", transform);
    g.appendChild(use);
    return g
}

function createCard(index, transform) {
    // Start off with a base card
    let newCard = createElement(
        "baseCard",
        cardPositionGenerator(index)
    )

    // Describe the set of all cards
    // const pips = ['♠','♥','♦','♣'];
    const pips = ['☀','☾','⚜','♛'];
    const ranks = ['A', '2', '3', '4', '5'];
    const max_rank = ranks.length;

    // Determine what goes on this specific card
    const pip_index = Math.floor(index / max_rank);
    const rank_index = index % max_rank;

    // Add stuff specific to this card
    var rank = document.createElementNS(svgns, "text");
    rank.setAttribute("x", "0");
    rank.setAttribute("y", "20");
    rank.setAttribute("fill", "black");
    rank.setAttribute("font-family", "monospace");
    rank.setAttribute("font-size", "200%");
    rank.innerHTML=ranks[rank_index];
    newCard.appendChild(rank);

    var pip = document.createElementNS(svgns, "text");
    pip.setAttribute("text-anchor", "middle");
    pip.setAttribute("x", cardDimensionsMm[0]/2);
    pip.setAttribute("y", 3*cardDimensionsMm[1]/4);
    pip.setAttribute("fill", "black");
    pip.setAttribute("font-size", "500%");
    pip.setAttribute("font-family", "monospace");
    pip.innerHTML=pips[pip_index % pips.length];
    newCard.appendChild(pip);

    var svgindex = document.createElementNS(svgns, "text");
    svgindex.setAttribute("text-anchor", "middle");
    svgindex.setAttribute("x", cardDimensionsMm[0]/2);
    svgindex.setAttribute("y", "10");
    svgindex.setAttribute("fill", "black");
    svgindex.setAttribute("font-family", "monospace");
    svgindex.setAttribute("font-size", "50%");
    svgindex.innerHTML=index+1;
    newCard.appendChild(svgindex);

    return newCard;
}

//////////////////////////////////////
// Draw the board by referencing and transforming the basic shapes
//////////////////////////////////////

/// Return a transform string to place this card on the page. Don't know if
/// this is going to be hard-coded to bridge size on A4 forever yet...
function cardPositionGenerator(index) {
    const max_cards_on_page = 11;
    const num_landscape_cards = 6;

    // We don't do anything with page yet. All the pages draw over each other :D
    const page = Math.floor(index / max_cards_on_page);
    // The i-th card on this page
    let i = index % max_cards_on_page;

    let transform = ''; // The transform we're going to return
    if (i < num_landscape_cards) { // The six landscape cards
        const x = cardDimensionsMm[0] * (i%2);
        const y = cardDimensionsMm[1] * Math.floor(i/2);
        transform += 'translate(' + x + ',' + y + ') '
    } else { // The remaining landscape cards
        i -= num_landscape_cards;
        // Order does matter here...
        transform += 'translate(' + cardDimensionsMm[0]*2 + ', ' + cardDimensionsMm[0]*(i+1) + ') ';
        transform += 'rotate(-90) ';
    }

    return transform
}

function main() {
    const max_cards = 11;
    const start_at = 0; // The first card index on this page
    for (let num = 0; num < max_cards; ++num) {

        let newCard = createCard(
            num + start_at,
            cardPositionGenerator(num)
        )
        svg.appendChild(newCard);
    }
}

main();
