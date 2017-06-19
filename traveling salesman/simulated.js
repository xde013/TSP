var cities = [];
var order = [];
var count = 0; // Initialize counter
var cityNum = 11; // Number of nodes in the our graph representing cities
var total = factorial(cityNum); // Total number of possible paths
var percent;
var temp = 3000;
// Canva setup or init
function setup() {
  createCanvas(500, 500);

  // Create the graph
  for (var i = 0; i < cityNum; i++) {
    var vector = createVector(random(width / 10, width - 50), random(height / 10, height - 50)); // randomly populating cities
    cities[i] = vector;
    order[i] = i;
  }

    /*for (var i = 0; i < popSize; i++) {
    population[i] = shuffle(order);
  }*/
  
  minPath = initPath(cities, order);
  console.log("minPath: " + minPath);
  
  order[cityNum] = 0; // Closing the order path
  minPath[cityNum] = 0; // Closing the minPath
  bestCost = pathCost(minPath);
  
  order = minPath.slice();
 
}

function draw() {
  frameRate(60);
  background(0);
  fill(255);

  // Draw the graph
  for (var i = 0; i < cities.length; i++) {
    ellipse(cities[i].x, cities[i].y, 8, 8);
  }

  stroke(255);
  strokeWeight(2);
  noFill();

  // Real time tries
  beginShape();
  for (var i = 0; i < order.length; i++) {
    var n = order[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape();

  stroke(0, 255, 0);
  strokeWeight(3);
  noFill();
  beginShape();

  // Draw current best path
  for (var i = 0; i < minPath.length; i++) {
    var n = minPath[i];
    vertex(cities[n].x, cities[n].y);
  }
  endShape();

  
  next(0.93, order); // get the next improved path
  console.log("min path cost:" + pathCost(minPath));

  textAlign(CENTER);
  stroke(255);
  noFill();
  percent = 100 * (count / total);
  textSize(24);
  text(nf(percent, 1, 6) + "% explored", 10, height - 20, width); // inaccurate if cityNum is more than 11 :[

}


// Our iterative function
function next(rate, order) {
  temp = rate*temp;
  if ( temp > 0.1 ) {
      console.log("temp = " + temp);
      newPath = getSimilarPath(order);
      currentCost = pathCost(order);
      newCost = pathCost(newPath);

    if ( moveNext(currentCost, newCost, temp)) {
      count++;
      order = newPath;
      console.log("new path is set as path");
      if ( newCost < bestCost ) {
        console.log("Found a winner here!");
        minPath = order.slice();
        bestCost = newCost;
      } 
    } else {
      console.log("new path is not set a path");
    }
  } else {
    console.log("I'm finished, it's freezing here!");
    noLoop();
    return;
  }
}

// Calculate path cost..
function pathCost(route) {
  var sum = 0;
  for (var i = 0; i < route.length - 1; i++) {
    var indexA = route[i];
    var indexB = route[i + 1];
    var d = dist(cities[indexA].x, cities[indexA].y, cities[indexB].x, cities[indexB].y);
    sum += d;
  }
  return sum;
}

// returns random neighbor using 2-opt
function getSimilarPath(arr) {
  res = swaps(arr);
  return res[Math.ceil(Math.random()*res.length) - 1];
}

// Decides if it should move to the next path or not
function moveNext(currentCost, newCost, temp ) {
  if ( newCost < currentCost ) {
    return true;
  } else {
    if ( newCost > currentCost ) {
         console.log((Math.exp(-(newCost - currentCost) / temp)));
    return Math.random() <= (Math.exp(-(newCost - currentCost) / temp)) ;
    }
  }
}


// Nearest Neighbor Path
function initPath(arr, order) {
  var visited = [order[0]];
  var minIndex;
  for (var i = 0; i < arr.length - 1; i++) {
    var min = 999999;
    var indexA = visited[visited.length - 1];
    for (var j = 0; j < arr.length; j++) {
      var indexB = order[j];
      if (indexB != indexA && !visited.includes(indexB)) {
        console.log("comparing " + indexA + " and " + indexB);
        var distance = dist(arr[indexA].x, arr[indexA].y, arr[indexB].x, arr[indexB].y);
        if (distance < min) {
          min = distance;
          minIndex = indexB;
        }
      }
    }
    visited.push(minIndex);
    console.log("pushed " + minIndex);
  }
  return visited;
}

// n!
function factorial(n) {
  if (n == 1) {
    return 1
  } else {
    return n * factorial(n - 1)
  }
}
// One Swap
function swap(arr, i, k) {
  return arr.slice(0, i - 1).concat(arr.slice(i - 1, k).reverse(), arr.slice(k));
}
// All possible swaps
function swaps(arr) {
  var res = [];
  for (var i = 2; i < arr.length - 1; i++) {
    for (var k = i + 1; k < arr.length; k++) {
      res.push(swap(arr, i, k));
    }
  }
  return res;
}