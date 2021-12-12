Part 2 was a struggle, I didn't see how to deduce segment sets beyond the fixed 1, 4, 7 and 8.  Looking through the logic from https://github.com/KingPeter1024/PeterAdventOfCode/blob/master/src/2021/day8.js it makes sense that you can use the known segment sets to "filter" subsets that map to other numbers.  It's a pretty slick solution.

Take the "6", it has 6 segments, as does "0" and "9".  However the segments that make up "7" is a subset of "0" and "9" but not "6".
 _     _      _                _
|     | |    | |                |
 —            —         vs      
| |   | |      |                |
 —     —      -           

That means of the 6 segment sets, only one that is not a superset of the segments making up "7" can be the "6".