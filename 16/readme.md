Day 16 should have been a nice simple one for me. But I had to dig a hole for a few hours before a I popped up to daylight.  
  
I made a small error, when processing the nested packets. Specifically with the `countType` `0`. For these packets the first 15 bits after the `countType` determine the length of the subpackets.  You can then process that chunk as an "isolated subpacket set"  But when I wrote part one, I just wiffed.  This is a great example of where I would have been saved by TDD.  I correctly pulled 15 bits off the stack, but then simply took the Length of that as the total length of the subsets. When I kept getting the wrong answer, I just kept hacking away at it until I cobbled togeher my solution for Part1.  It works, but it shouldn't. 

```

bitArray.splice(0, 15).length

s/b
parseInt(bitArray.splice(0, 15), 2)

```

As soon as I started Part2 - I hit a wall.  Through excessive logging I finally noticed that all of my subpacket lengths were exactly 15.  Very odd.

Just goes to show, being lazy and just cranking code often leads to a lot more work than do ing the hard work up front  

One other note, for converting the Hex --> Bin, I used the `parseInt` approach in Part2.  It's probably not faster, but felt cleaner