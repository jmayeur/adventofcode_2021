This was an interesting challenge. The structure lends itself to brute-force solutions for smaller mutation sets.  However the scale of they data set grows rapdily and brute-force approachs are no longer practical.


Looking at a sequence like AA, with insertions AA -> B, AB -> B, BB -> A, BA -> A; you can see how quickly the sequence would grow. Here's a few iterations.  After 7 we're at 129 characters.  Looking at the grown, each step grows by ***NexStepLength = StepLength + (StepLength - 1)***

0:AA  
1:ABA  
2:ABBAA  
3:ABBABAABA  
4:ABBABAABBAABABBAA  
5:ABBABAABBAABABBABAABABBAABBABAABA  
6:ABBABAABBAABABBABAABABBAABBABAABBAABABBAABBABAABABBABAABBAABABBAA  
7:ABBABAABBAABABBABAABABBAABBABAABBAABABBAABBABAABABBABAABBAABABBABAABABBAABBABAABABBABAABBAABABBAABBABAABBAABABBABAABABBAABBABAABA  

Given this, solving Part 2, requires an approach that doesn't rely on using a string.  To solve this I had to look at what was really happening at each mutation.  Using the example above

AA --> ABA - In this case 2 things happened, 1 ***B*** was added, and 1 ***AA*** Pair was lost.
To process the next iteration I need to break out the pairs that were created, 1 ***AB*** and 1 ***BA***.  Let's make a map of our values.  
  
chars = {A: 2} // There's 2 ***A*** to start  
pairs = {AA: 1} // There's 1 ***AA*** pair to start  
  
After processing one iteration I would now have  
chars = {A: 2, B: 1} // 1 ***B*** was inserted  
pairs = {AA: 0, AB: 1, BA: 1} // we "used" the ***AA*** pair, but created 1 new ***AB*** and ***AB*** pair  

After processing another iteration I would have  
chars = {A: 3, B: 2} // we added 1 ***B*** and 1 ***A***  
pairs = {AA: 1, AB: 1, BA: 1, BB: 1} // used ***AB***, ***BA***, made 1 ***AB***, ***BB***, ***BA***, ***AA***  
  
---skiping ahead---  
After Step 4  
chars = { A: 9, B: 8 }  
pairs = { AA: 3, AB: 5, BA: 5, BB: 3 }  
  
After Step 5  
chars = { A: 17, B: 16 }  
pairs = { AA: 5, AB: 11, BA: 11, BB: 5 }  
  
You can see the number of pairs & letters growing quickly, but the dataset size is very manageable.  It turns out the following changes are what happens for each pair mutation
  
Take ***AB: 5***, ***B: 8*** from step 4 above.  If we process/insert the change:  
  
We use up 5 ***AB***s in this step  
We add 5 Bs  
We add 5 ABs  
We add 5 BAs  
  
count = pairs.AB  
pairs.AB -= count  
pairs.AB += count  
pairs.BA += count  
  
chars.B += count  

  
Gotcha - You can't mutate the "map" your using to build the next iteration  