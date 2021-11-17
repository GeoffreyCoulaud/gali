# Brag
A game launcher for **linux** where your library is the star of the show.

## Why, how ?
> I'm so tired of interfaces that inlude 9 out 10 of my games. I want it all in one, pretty, place ! 

If you think alike, I believe Brag is for you. 

However, if you want a single place to install, configure and manage your games, 
this is not the intended purpose of Brag. This project is for *brag*ging, showing off your library. 
You will have to install other software to manage your games, they will definitely do it better.

## Supported sources
Name            | Description                                | Notes
--------------- | ------------------------------------------ | -----------------
Steam           | PC games store                             | Installed games
Legendary       | FOSS Epic Games Launcher alternative (CLI) | Installed games
Lutris          | Open Source gaming platform for Linux      | -
Heroic          | FOSS Epic Games Launcher alternative (GUI) | -
Desktop entries | Regular linux desktop entries              | -
Retroarch       | Frontend for the libretro API              | -
Dolphin         | Nintendo Wii / GameCube emulator           | -
Citra           | Nintendo 3DS emulator                      | -
Yuzu            | Nintendo Switch emulator                   | -
PPSSPP          | Sony PSP emulator                          | -
Cemu            | Nintendo Wii U emulator                    | Cemu from lutris

## Usage
**Brag is in active development but is just not there yet. Be patient !**

### Dependencies
* Main app 
	* `node` 
	* `npm`
* Node-Gtk ([refer to the docs](https://github.com/romgrk/node-gtk#installing-and-building)) : 
	* `git`
	* `python2` (for `node-gyp`)
	* a C compiler (`gcc`≥8 or `clang`)
* Supported sources programs (optional)

### Dev usage
1. Install the dependencies mentionned above.
2. Clone this repo and `cd` into it.  
3. Install NPM dependencies `npm i`
4. Start `npm run start`

## Known issues
* Games from Steam, Legendary, Heroic can be started but not stopped or killed
* Dolphin emulator games don't get distinguished between GameCube and Wii
* Installed Citra games aren't listed
* Installed Yuzu games aren't listed
* Cemu in lutris is a clunky solution, but it's the best we currently have on linux

## TODO
* Implement UI (see [dedicated document](./resources/ui_design_process.md))
* Add option in Dolphin to read cached games
* Add a better way to handle nested sources (event on game push)
* Better installation instructions
* Additional sources
	* itch.io
	* Retroarch (in Steam)
	* Bethesda launcher (in Lutris)
	* Origin (in Lutris)
	* Battle_net (in Lutris)
	* Uplay (in Lutris)
	* Teknoparrot (in Lutris)(create installer first)
* Fix game metadata (see [dedicated document](./resources/fixing_game_metadata.md))
* Regroup duplicate games entries (eg. PPSSPP & Retroarch) into a "multiple source game"