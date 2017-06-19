var cities = [];
var order = [];
var count = 0; // Initialize counter
var cityNum = 30; // Number of nodes in the our graph representing cities
var total = factorial(cityNum); // Total number of possible paths
var percent;
var interval;
var t1; // Begin time
var path = [];
var fin;
// Canva setup or init
function setup() {
  createCanvas(500, 500);

  // Create the graph
  for (var i = 0; i < cityNum; i++) {
    var vector = createVector(random(width / 10, width - 50), random(height / 10, height - 50)); // randomly populating cities
    cities[i] = vector;
    order[i] = i;
  }

  minPath = initPath(cities, order);
  console.log("minPath: " + minPath);
  
  order[cityNum] = 0; // Closing the order path
  minPath[cityNum] = 0; // Closing the minPath
  currentCost = pathCost(minPath);
  t1 = new Date(); // Begin time
  path = order.slice();
}

function draw() {
  frameRate(5);
  background(0);
  fill(255);

  // Draw the graph
  for (var i = 0; i < cities.length; i++) {
    ellipse(cities[i].x, cities[i].y, 8, 8);
  }


  if ( !fin ) {
  stroke(255);
  strokeWeight(2);
  noFill();
    // Draw current best path
    for (var i = 0; i < path.length; i++) {
      var n = path[i];
      vertex(cities[n].x, cities[n].y);
    }
  endShape();
  }


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

 

  path = order.slice();
  order = next(minPath); // get the next improved path
  if (order) { // do not get the cost of path if order is not set!
    var d = pathCost(order);
  }
  if (d < currentCost) {
    minPath = order.slice();
    currentCost = d;
    console.log("current best path: ");
    console.log(minPath);
    console.log("cost: " + d);
  }

  textSize(32);
  textAlign(CENTER);
  stroke(255);
  noFill();
  percent = 100 * (count / total);
  t2 = new Date();
  interval = t2 - t1;
  text("Completed in " + interval + "ms", 10, height / 10, width);
  textSize(24);
  text(nf(percent, 1, 6) + "% explored", 10, height - 20, width); // inaccurate if cityNum is more than 11 :[

}

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

function next(path) {
  count++;
  var swapies = swaps(path);
  var min;
  var current = pathCost(path);
  //var i = Math.ceil(Math.random()*swapies.length) - 1; <= random choosen swap! (Simple 2-Opt)
  for (var i = 0; i < swapies.length; i++) {
    swapy = swapies[i];
    var d = pathCost(swapy);
    if (d < current) {
      min = swapy;
      current = d;
    }
  }
  if (min) {
    return min;
  } else { // if no improvements are made min will be undefined => false then
    console.log("Finnished, byebye, bssalama elik");
    fin = true;
    noLoop(); // exit from the draw() loop
    return; // to actually exit from the draw() loop..
  }
}

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