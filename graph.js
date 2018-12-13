function getParameters ( func ) {
    let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
    let ARGUMENT_NAMES = /(?:^|,)\s*([^\s,=]+)/g;
    let fnStr = func.toString().replace(STRIP_COMMENTS, '');
    let argsList = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')'));
    let result = argsList.match( ARGUMENT_NAMES );

    if(result === null) {
        return [];
    }
    else {
        let stripped = [];
        for ( let i = 0; i < result.length; i++  ) {
            stripped.push( result[i].replace(/[\s,]/g, '') );
        }
        return stripped;
    }
}

class lazyGraph {
    constructor() {
        this.graph = null;
        this.results = null;
    }

    receiveGraph(graph) {
        this.graph = graph;
        this.results = [];
        return this;
    }

    evalVertex(vertex,callStack=[]) {
        if (this.graph === null) throw new ReferenceError("Graph is not init.");
        if (!(vertex in this.results)) {
            if (!(vertex in this.graph)) throw new RangeError("Vertex not find: " + vertex);
            let func = this.graph[vertex]
            if (func.length !== 0) {
                if (callStack.includes(vertex)) throw new RangeError("Cyclic dependencies")
                callStack.push(vertex);
                let params = getParameters(func);
                this.results[vertex] = func(...params.map(enVertex => this.evalVertex(enVertex, callStack)));
                callStack.pop;
            }
            else this.results[vertex] = func();
        }
      return this.results[vertex];
    }

    calcVertex(vertex,callStack=[]) {
        return this.evalVertex(vertex);
    // Вот здесь, код, который будет вычислять значение заданной вершины. Например для myAmazingGraph вершинами может быть любое из значений 'xs', 'm', 'm2' ,'v', 'xs'
   // пример вызова и результата: lazyGraph.receiveGraph(myAmazingGraph).calcVertex(m2) === 2
    }
}

class eagerGraph extends lazyGraph {
    receiveGraph(graph) {
        this.graph = graph;
        this.results = [];
        Object.keys(graph).forEach(vertex => this.evalVertex(vertex));
        return this;
    }

    calcVertex(vertex,callStack=[]) {
        if (this.graph === null) throw new ReferenceError("Graph is not init.");
        if (vertex in this.results) return this.results[vertex];
        else throw new RangeError("Vertex not find: " + vertex);
    }
}

module.exports = {
  lazyGraph: lazyGraph,
  eagerGraph: eagerGraph
}