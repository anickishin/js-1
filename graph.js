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

const lazyGraph = {
    receiveGraph(graph) {
        this.graph = graph;
        this.results = [];
        return this;
    },
    calcVertex(vertex,callStack=[]) {
        if (!(vertex in this.results)) {
            if (!(vertex in this.graph)) throw new RangeError("Vertex not find: " + vertex);
            let func = this.graph[vertex]
            if (func.length !== 0) {
                if (callStack.includes(vertex)) throw new RangeError("Cyclic dependencies")
                callStack.push(vertex);
                let params = getParameters(func);
                this.results[vertex] = func(...params.map(enVertex => this.calcVertex(enVertex, callStack)));
                callStack.pop;
            }
            else this.results[vertex] = func();
      }
      return this.results[vertex]
    // Вот здесь, код, который будет вычислять значение заданной вершины. Например для myAmazingGraph вершинами может быть любое из значений 'xs', 'm', 'm2' ,'v', 'xs'
   // пример вызова и результата: lazyGraph.receiveGraph(myAmazingGraph).calcVertex(m2) === 2
    }
}

const eagerGraph = {
    receiveGraph(graph) {
        let lazy = lazyGraph.receiveGraph(graph)
        Object.keys(graph).forEach(vertex => lazy.calcVertex(vertex))
        return lazy
    }
}

module.exports = {
  lazyGraph: lazyGraph,
  eagerGraph: eagerGraph
}