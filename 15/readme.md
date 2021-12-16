I definitely needed help with this.  I needed an algorithm, and after some Googling - I landed on [Dijkstra's Algorithm](https://dev.to/maikomiyazaki/completed-javascript-data-structure-course-and-here-is-what-i-learned-about-graph-dijkstra-algorithm-57n8).  

To make it work for Part 1

I needed to make a Graph from from the seed matrix. For this short example
```
195
432
185
```
A graph with no diagonals would look like this
```
1 - 9 - 5
|   |   |
4 - 3 - 3
...
```

Meaning for vertex/node `0,0` ***1***, it would have the neighors `[9, 4]` or `[{1,0},{0,1}]`. Turning that graph in to a Map would look like
```
1: [9, 4],
9: [1, 5, 3],
5: [9, 3],
4: [1, 3, 1],
3: [9, 4, 5, 8]
...
```

Once you have a graph, you can walk it using Dijkstra's Algorithm to find the shortets/least risky path


For Part 2
This approach is a bit slow, but still works.  First you have to expand the input matrix according to the rules. Then it will run for a few seconds.  I'm sure there are better algorithms, but this worked for my purposes