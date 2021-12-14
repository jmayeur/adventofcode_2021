This is another one I struggled with.  I took lot's of passed as this, but the one piece I kept missing was building the inverse part of the graph.  So for the "Test Data 1" set below, I would build a map that looked like

start: A, b
A: c, b, end
b: d, end
c: A
d: b


That, that meant that the "neighbors/edges" were missing when I would iterate the leaves.  Instead I needed a map that pointed back up to partents from each child ex.:

start: A, b
A: *start*, c, b, end
b: *start A*, d, end
c: A
d: b
*end: A, b*

These addtional leveas allowed the "Depth First" iterator (recursive) to fully traverse the tree


Test Data 1:
start-A
start-b
A-c
A-b
b-d
A-end
b-end