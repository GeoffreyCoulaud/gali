# Brag
A game launcher for **linux** where your library is the star of the show.

## Why, how ?
> I'm so tired of interfaces that inlude 9 out 10 of my games. I want it all in one, pretty, place ! 

If you think alike and are tired of starting 3 programs before finding the one that lists that one game you want to play, I believe Brag is for you. 

However, if you want a single place to install, configure and manage your games, this is not the intended purpose of Brag. This project is for *brag*ging, showing off your library. You will have to install other software to manage your games, they will definitely do it better.

## Supported sources
Name | Description | Notes
---- | ----------- | -----
Steam | PC games store | Only installed games
Lutris | Open Source gaming platform for Linux | Only installed games
Retroarch | Frontend for the libretro API | -
Dolphin | Nintendo Wii / GameCube emulator | -
Citra | Nintendo 3DS emulator | -
Yuzu | Nintendo Switch emulator | -
Cemu | Nintendo Wii U emulator | Cemu installed from lutris

## Usage
**Brag is in active development but is just not there yet. Be patient !**

### Current requirements
* nodejs
* npm
* (optional) supported sources programs

### Dev usage
```sh
git clone https://github.com/GeoffreyCoulaud/brag-launcher.git
cd brag-launcher
npm install
npm run start
```

## Known issues
* Dolphin emulator games don't get distinguished between GameCube and Wii
* Installed Citra games aren't listed
* Installed Yuzu games aren't listed
* Cemu in lutris is a clunky solution, but it's the best we have currently on linux  

## TODO
* Legendary launcher support
* Start method for all game types
* Launcher UI
* Fix game metadata (see dedicated section)
* Regroup duplicate games entries (eg. PPSSPP & Retroarch) into a "multiple source game"

## Fixing game metadata
### The problem
For frontends like this one it just isn't enough to get a ROM file that can be played. Brag's goal is to *see and play* your library, to be able to choose a game to play for a chill session or with friends. The games are the star of the show, not any software around them. (Though, you should support projects you like if you have the means !)

This means multiple things must be extracted from a game file name
1. Original name,
2. Localized names,
3. Images (icon, box art, banners...)
4. Other info (publisher, developer, release year...),

Note that for this project points 1-3 are mandatory in my opinion.

### Possible solutions  
* __crc32 based recognition__, useful only for known good ROMs. This is the preferred option in most cases because most of the ROMs people have are the "good" ones, and it's insanely fast to get this value for most files compared to other identification methods.

* __filename based recognition__, useful for well-named ROMs. This is for "the rest", bad dumps, translations, hacks, compressed ROMs or a brand new format that the emulator can play but the good roms database doesn't have yet.

* __content based recognition__, useful for unpacked ROMs. This is the best case scenario, we don't have any guess work to do, the game provides its metadata.

However this comes with the cost of having to rely on a trusted game database. This is fine in itself, but rubs me in the wrong way in the case of hash based recognition (which is the way retroarch does it). It's just not reliable enough. I want a solution that is **not necessarily fast** but is **reliable** even with uncommon / bad data and **accurate** enough to not produce weird results. 