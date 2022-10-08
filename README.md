# Binance Challenge

## Challenge

Find the number of accessible coordinates by Alice while avoiding bombs. 
[challenge](./challenge/Solutions%20Team%20Interview%20Homework%20V3.pdf) file.


## Code
The code is written in the [following file](./src/challenge.js)


## Explanation

- Finding the map's borders
I first identify the map's borders (delimited by bombs). I search the number by which all the digit's sum is over the number at which Bill set Bombs.
- Finding accessible cells in 1`/4 of the map
I then loop all the positive coordinates, working on 1/4 of the map, going from left to right and up to down until the borders. This allows me to add all the accessible cells from cell [0,0] to a hashmap. In order to ensure that previous cells have been added, I check if the upper cell or the lefter cell is included in the hashmap. 
- Finding the total number of accessible cells
After finding all positive accessible coordinates, as each map sides are symmetric, I multiply the amount of coordinates found by 4 to account for coordinates with negative values. To avoid to double the amount of coordinates with a value equal to 0, I remove the amount of the map border to the amount of positive accessible coordinates. Finally I add the coordinate [0,0] to the amount of accessible coordinates.

In the solution, we use a hashmap rather than an array to accelerate the checking of coordinates that are accessible.
The search value of hashmap is O(1) where it is equal to O(n) for an array.

## Command

- Run `npm run challenge` to get the result of accessible coordinates.
- Run `npm run debug` if you want to recreate the map

## Annex

There may be a way to find the number of accessible coordinates by Alice with a mathematical function. 
The file [column](./file/column.json) show the number of accessible coordinates in each columns. We can see that there is a linearity in the numbers of accessible coordinates while comparing columns.