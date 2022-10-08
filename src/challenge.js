const path = require('path');
const fs = require('mz/fs');

// Number at which Bill start to plant Bombs
const LIMIT_NUMBER = 21;

/**
 * Returns current directory to save files
 * 
 * @returns {string} Current directory
 */
function getDir() {
    return path.join(__dirname, './');
}

/**
 * Calculates the sum of the absolute value of the coordinates digit.
 * 
 * @param {number} X - The vertical value, X coordinate
 * @param {number} Y - The horizontal value, Y coordinate
 * @returns {number} Sum of X and Y digit's value 
 */
function calculateNumber(X, Y) {
    return (
        Math.abs(X).toString().split('').map(Number).reduce(function (a, b) { return a + b; }, 0) 
        + Math.abs(Y).toString().split('').map(Number).reduce(function (a, b) { return a + b; }, 0)
    );
}

/**
 * Returns Map Borders from which Alice can't go further. Look at which number's digit sum is higher than the limit number.
 * Bombs are placed based on the sum of absolute values, thus a limit is set in the map at a specific number coordinate. 
 * 
 * @returns {number} Number with sum digit higher than the limit number 
 */
function findMapBorders() {
    let bordersValue = 0;
    while (calculateNumber(0, bordersValue) <= LIMIT_NUMBER) {
        bordersValue += 1;
    }
    return bordersValue;
}


/**
 * Saves the accessible coordinates by Alice in the file final.json
 * 
 * @param {string[]} accessibleCoordinates - The array containing all coordinates accessible by Alice
 */
function saveAccessibleCoordinates(accessibleCoordinates) {
    const filename = path.join(getDir(), '../file/final.json');
    fs.writeFile(filename, JSON.stringify(Object.fromEntries(accessibleCoordinates)), 'utf8');
}

/**
 * Writes the map that represent all Alice's accessible coordinates founded by the function solution in txt file 'foundPath'.
 * The value X represents bombs and the value O represents coordinates where alice can go.
 * 
 * @param {number} bordersValue - The borders limit of the map that should be written in the file 'foundPath'
 * @param {string[]} map - A map containing all the coordinates accessible by Alice
 */

function createMap(bordersValue, map) {
    let solutionPaths = "";
    for (let i = -bordersValue; i < bordersValue; i++) {
        for (let j = -bordersValue; j < bordersValue; j++) {
            solutionPaths += i === 0 && j === 0 ? 'N' : map.has(`${Math.abs(i)},${Math.abs(j)}`) ? 'O' : 'X';
        }
        solutionPaths += '\n';
    }
    filename = path.join(getDir(), '../file/foundPath.txt');
    fs.writeFile(filename, solutionPaths, 'utf8');
}


/**
 * @typedef {Object} Solution
 * @property {number} numAccessiblePoint - The number of accessible coordinates by Alice
 * @property {number} bordersValue - The value of the map's border
 * @property {string[]} accessibleCoordinates - The array of all accessible coordinates by Alice
 */

/**
 * Finds all accessible coordinates by Alice. 
 * 
 * The function first look at the borders of the map at which Alice can't go further. 
 * As the calculation takes absolute value, all result should be symmetric to the positive value. From the coordinates [0,0],
 * look at each positive coordinates accessible until the border. As coordinates with reverse value of accessible 
 * coordinates are also accessible, we can reduce the number of loop to half by directly adding them to the map.
 * The number of accessible coordinates is equal to the number of positive coordinates multiple by 4 to represent 
 * coordinates with negative values. We remove the border's coordinates to avoid to double coordinates that are at border sides.
 * We add one to count the value [0,0]. 
 * 
 * @returns {Solution} The solution of the challenge combined with the value needed to create the map
 */
function findAccessibleCoordintates() {
    let accessibleCoordinates = new Map();
    accessibleCoordinates.set('0,0', 'Alice');

    let bordersValue = findMapBorders();
    let date1 = new Date();
    const half = Math.ceil(bordersValue / 2);

    for (let X = 0; X < half; X++) {
        for (let Y = 0; Y < bordersValue; Y++) {
            if (calculateNumber(X, Y) <= LIMIT_NUMBER) {
                if (
                    (accessibleCoordinates.has(`${X - 1},${Y}`) || accessibleCoordinates.has(`${X},${Y - 1}`))
                    && !accessibleCoordinates.has(`${X},${Y}`)
                ) {
                    accessibleCoordinates.set(`${X},${Y}`, 'Accessible');
                    if (Y >= half) {
                        accessibleCoordinates.set(`${Y},${X}`, 'Accessible');
                    }
                }
            }
        }
    }
    console.log("Time: ", (new Date() - date1) / 1000);
    saveAccessibleCoordinates(accessibleCoordinates);

    return {
        numAccessiblePoint: ((accessibleCoordinates.size - bordersValue) * 4) + 1,
        bordersValue,
        accessibleCoordinates
    };
}

const { numAccessiblePoint, bordersValue, accessibleCoordinates } = findAccessibleCoordintates();

// Create the map
if(process.env.DEBUG) {
    console.log("Creating the map");
    createMap(bordersValue, accessibleCoordinates);
}

// Show Result
console.log('All accessible points: ', numAccessiblePoint);