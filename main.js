const { lazyGraph, eagerGraph } = require('./graph')

function logCalc(graph, vertex) {
    try {
        console.log(graph.calcVertex(vertex));
    }
    catch (e) {
        console.log(e.message);
    }
}

const myAmazingGraph = {
  n: (xs) => xs.length,
  m: (xs, n) => xs.reduce((store, item) => item + store, 0) / n,
  m2: (xs, n) => xs.reduce((store, item) => item * store, 1) / n,
  v: (m, m2) => m*m - m2,
  xs: () => [1, 2, 3]
}

const myAmazingGraph2 = {
  n: (a) => a,
  b: (n) => n,
  z: (x) => x,
  x: (z) => z,
}

let lG1=new lazyGraph();
lG1.receiveGraph(myAmazingGraph);

let eG1=null;
try {
    eG1=new eagerGraph().receiveGraph(myAmazingGraph);
}
catch (e) {
    console.log(e.message);
}

let lG2=new lazyGraph().receiveGraph(myAmazingGraph2);

logCalc(lG1, 'xs');
logCalc(lG1, 'n');
logCalc(lG1, 'm');
logCalc(lG1, 'm2');
logCalc(lG1, 'v');
console.log("=====");
logCalc(eG1, 'xs');
logCalc(eG1, 'n');
logCalc(eG1, 'm');
logCalc(eG1, 'm2');
logCalc(eG1, 'v');
console.log("=====");
logCalc(lG2, 'a');
logCalc(lG2, 'n');
logCalc(lG2, 'z');
logCalc(lG2, 'x');
console.log("=====");

let eG2=null;
try {
    eG2=new eagerGraph().receiveGraph(myAmazingGraph2);
}
catch (e) {
    console.log(e.message);
}

//Object.keys(myAmazingGraph)//названия ф-ций
//myAmazingGraph.n.length//кол-во параметров
