//////////////////////////////////////
// CONFIGURABLE CONSTANTS
//////////////////////////////////////

const squareWidth = 100;   // Width of a "square", not including any separation
const numSquares = 4;      // Defines the dimensions of the entire board
const diamondRadius = 20;  // How wide the diamonds are
const separation = 8;      // Separation between diamonds and octagons

const cardDimensionsMm = [58, 90]
const a4DimensionsMm = [210, 297]

let card_order = convert_print_index_to_card_num
let card_border_color = 'lightgrey'

const debug = true
if (debug) {
    card_order = convert_print_index_to_debug_num
    card_border_color = 'black' // Makes it easier to cut
}

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
baseCard.setAttribute("stroke", card_border_color);
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

/**
 * Create a card from the Mystique Deck.
 * https://boardgamegeek.com/boardgame/141291/mystique-deck
 * Args:
 *   mystique_index: Each card in the mystique deck has a unique card number.
 */
function createMystiqueCard(mystique_card_num, transform) {
    // Start off with a base card
    let newCard = createElement(
        "baseCard",
        transform
    )
    // Grab a ref to the definitions... We'll be referring to it later
    const defs = document.querySelector("defs");

    // Describe the set of all cards
    // const pips = ['♠','♥','♦','♣'];
    // Other candidate symbols: ☪☾  ♚♔  🌣☀☼  ♕♛
    const pips = ['☾','☼','⚜','♕'];
    const ranks = ['A', '2', '3', '4', '5'];
    // Note: Color is not printed on the card.
    // It's expected that we will print on colored paper.
    const colors = ['yellow', 'red', 'blue'];

    // Determine what goes on this specific card
    const index = mystique_card_num - 1; // Zero-index so math is easier
    const pip_index = Math.floor(index / ranks.length / colors.length);
    const rank_index = index % ranks.length;
    const color_index = Math.floor(index / ranks.length) % colors.length;

    // Add stuff specific to this card

    let innerRect = document.createElementNS(svgns, "rect");
    const innerRectMargin = 14;
    innerRect.setAttribute("x", innerRectMargin);
    innerRect.setAttribute("y", innerRectMargin);
    innerRect.setAttribute("width", cardDimensionsMm[0] - 2*innerRectMargin);
    innerRect.setAttribute("height", cardDimensionsMm[1] - 2*innerRectMargin);
    innerRect.setAttribute("fill", "none");
    innerRect.setAttribute("stroke", "darkgrey");
    innerRect.setAttribute("stroke-width", "0.5");
    newCard.appendChild(innerRect);

    var corner_thing = document.createElementNS(svgns, "g");
    const corner_thing_id = "corner_" + mystique_card_num;
    corner_thing.setAttribute("id", corner_thing_id);
    defs.appendChild(corner_thing);

    var rank = document.createElementNS(svgns, "text");
    rank.setAttribute("text-anchor", "middle");
    rank.setAttribute("x", "0");
    rank.setAttribute("y", "13");
    rank.setAttribute("fill", "black");
    rank.setAttribute("class", "rank corner number");
    rank.innerHTML=ranks[rank_index];
    corner_thing.appendChild(rank);

    var corner_pip = document.createElementNS(svgns, "text");
    corner_pip.setAttribute("text-anchor", "middle");
    corner_pip.setAttribute("x", "0");
    corner_pip.setAttribute("y", "22");
    corner_pip.setAttribute("fill", "black");
    corner_pip.setAttribute("class", "pip corner");
    corner_pip.innerHTML=pips[pip_index % pips.length];
    corner_thing.appendChild(corner_pip);

    var top_thing = document.createElementNS(svgns, "g");
    const thing_indent = 7;
    top_thing.appendChild(createElement(corner_thing_id, 'translate(' + thing_indent + ', 0)'));
    top_thing.appendChild(createElement(corner_thing_id, 'translate(' + (cardDimensionsMm[0] - thing_indent) + ', 0)'));
    const top_thing_id = "top_" + mystique_card_num;
    top_thing.setAttribute("id", top_thing_id);
    defs.appendChild(top_thing);

    newCard.appendChild(top_thing);
    newCard.appendChild(createElement(top_thing_id, ''));
    newCard.appendChild(createElement(top_thing_id,
        'translate('+cardDimensionsMm[0]+', '+cardDimensionsMm[1]+') ' +
        'rotate(180) '
    ));

    var center_pip = document.createElementNS(svgns, "text");
    center_pip.setAttribute("text-anchor", "middle");
    center_pip.setAttribute("x", cardDimensionsMm[0]/2);
    center_pip.setAttribute("y", "60");
    center_pip.setAttribute("fill", "black");
    center_pip.setAttribute("class", "pip center");
    center_pip.innerHTML=pips[pip_index % pips.length];
    newCard.appendChild(center_pip);

    var svgindex = document.createElementNS(svgns, "text");
    svgindex.setAttribute("text-anchor", "middle");
    svgindex.setAttribute("x", cardDimensionsMm[0]/2);
    svgindex.setAttribute("y", "9");
    svgindex.setAttribute("fill", "black");
    svgindex.setAttribute("class", "card_number number");
    svgindex.innerHTML=mystique_card_num;
    top_thing.appendChild(svgindex);

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

/**
 * Convert a print index to a mystique card number. Determines the order of the
 * cards on the page.
 *
 * Mystique card numbers have cards grouped by suit.
 * When printing onto colored paper, it's more convenient to group by color.
 *
 * This function is overcomplicated nonsense. It would be much easier to just
 * hard-code the print order, as I have done anyway in the tests!!
 */
function convert_print_index_to_card_num(print_index) {
    // We want to group by color instead of suit
    const times_we_jumped = Math.floor(print_index / 5);
    const rank = print_index % 5;
    const color = Math.floor(print_index / 20);
    const result = (rank + (times_we_jumped * 3*5) + (color * 5)) % 60 + 1;

    return result;
}
function test_convert_print_index_to_card_num() {
    const print_order = [1,2,3,4,5,16,17,18,19,20,31,32,33,34,35,46,47,48,49,50,6,7,8,9,10,21,22,23,24,25,36,37,38,39,40,51,52,53,54,55,11,12,13,14,15,26,27,28,29,30,41,42,43,44,45,56,57,58,59,60]

    for (let num = 0; num < print_order.length; ++num) {
        expected = print_order[num];
        actual = convert_print_index_to_card_num(num);

        if (expected == actual) {
            console.log(num + ' -> ' + expected);
        } else {
            console.log(num + ' -> ' + expected, '(got ' + actual + ')');
        }
    }
}

/**
 * Convert a print index to a mystique card number. Determines the order of the
 * cards on the page.
 *
 * When making design tweaks, it's useful to scramble it up so we get a good
 * sampling of suits.
 */
function convert_print_index_to_debug_num(print_index) {
    return ((print_index * 13) % 60) + 1
}

function main() {
    const cards_per_page = 10;
    const page = 0;
    const start_at = cards_per_page * page; // The first card index on this page

    // Construct a page worth of cards
    for (let num = 0; num < cards_per_page; ++num) {

        let newCard = createMystiqueCard(
            card_order(num + start_at),  // Which card are drawing now?
            cardPositionGenerator(num)   // Where does the card go on the page?
        )
        svg.appendChild(newCard);
    }
}

main();
