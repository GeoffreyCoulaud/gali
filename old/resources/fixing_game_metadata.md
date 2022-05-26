# Fixing game metadata
## The problem
For frontends like this one it just isn't enough to get a ROM file that can be played. 
This app's goal is to *see and play* your library, to be able to choose a game to play for a chill session or with friends. 
The games are the star of the show, not any software around them. 
(Though, you should support projects you like if you have the means !)

This means multiple things must be extracted from a game file name
1. Original name,
2. Localized names,
3. Images (icon, box art, banners...)
4. Other info (publisher, developer, release year...),

Note that for this project points 1-3 are mandatory in my opinion.

## Possible solutions  
* __crc32 based recognition__, useful only for known good ROMs. 
This is the preferred option in most cases because most of the ROMs people have are the "good" ones, 
and it's insanely fast to get this value for most files compared to other identification methods.

* __filename based recognition__, useful for well-named ROMs. 
This is for "the rest", bad dumps, translations, hacks, compressed ROMs or a brand new format 
that the emulator can play but the good roms database doesn't have yet.

* __content based recognition__, useful for unpacked ROMs. 
This is the best case scenario, we don't have any guess work to do, the game provides its metadata.

However this comes with the cost of having to rely on a trusted game database. 
This is fine in itself, but rubs me in the wrong way in the case of hash based recognition (which is the way retroarch does it). 
It's just not reliable enough. I want a solution that is **not necessarily fast** but is **reliable** even with uncommon / bad data 
and **accurate** enough to not produce weird results. 