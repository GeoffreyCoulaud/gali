# GALI

![GitHub](https://img.shields.io/github/license/GeoffreyCoulaud/gali?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/GeoffreyCoulaud/gali?style=for-the-badge)

A game launcher for **linux** where your library is the star of the show.

## Why ?
> I'm so tired of interfaces that include 9 out 10 of my games. I want it all in one, pretty, place ! 

If you think alike, I believe Gali is for you. 

However, if you want a single place to install, configure and manage your games, 
this is not the intended purpose of Gali. This project is made to display your games library. 
You will have to install other software to manage your games, they will definitely do it better.

## Supported sources
As of 21/11/2021

Status | Name                               | Description                                
------ | ---------------------------------- | -----------------------------------------
✅ (1) | Steam                              | PC games store
🔶 (3) | Steam (flatpak)                    | -
✅ (1) | Legendary                          | FOSS Epic Games Launcher alternative (CLI)
✅     | Lutris                             | Open Source gaming platform for Linux
✅ (1) | Heroic                             | FOSS Epic Games Launcher alternative (GUI)
🔶 (3) | Heroic (flatpak)                   | -
✅     | Desktop entries                    | Regular linux desktop entries
✅     | Retroarch                          | Frontend for the libretro API
🔶 (3) | Retroarch (flatpak)                | -
✅     | Dolphin                            | Nintendo Wii / GameCube emulator
🔶 (3) | Dolphin (flatpak)                  | -
🔶 (2) | Citra                              | Nintendo 3DS emulator
🔶 (3) | Citra (flatpak)                    | -
🔶 (2) | Yuzu                               | Nintendo Switch emulator
🔶 (3) | Yuzu (flatpak)                     | -
✅     | PPSSPP                             | Sony PSP emulator
🔶 (3) | PPSSPP (flatpak)                   | -
✅     | Cemu                               | Nintendo Wii U emulator

1. **Steam**, **Legendary** and **Heroic** only allow starting games, not stopping or killing them
2. **Citra** and **Yuzu** installed games are not scanned (only roms are scanned)
3. **Flatpak** games are not startable yet

## Usage
**This is in active development but is just not there yet. Be patient !**

### Dependencies
* Main app (will soon change dependencies)
	* `node`
	* `npm`
* Supported sources programs (optional)

### Dev usage
Install the dependencies mentionned above, then :

```sh
git clone https://github.com/GeoffreyCoulaud/gali.git
cd gali
npm i
npm run start
```

## Known issues
* Games from Steam, Legendary, Heroic can be started but not stopped or killed
* Cemu in lutris is a clunky solution, but it's the best we currently have on linux

## TODO
* Implement UI (see [dedicated document](./resources/ui_design_process.md))
* Add a better way to handle nested sources
* Steam : Exclude hidden games
* Flatpak sources : Process start/stop/kill
* Dolphin : Scan cached games
* Dolphin : Differenciate between Gamecube and Wii games
* Yuzu : Scan installed games
* Citra : Scan installed games
* Better installation instructions
* Additional sources
	* bottles
	* itch.io
	* Decaf
	* Ryujinx
	* Retroarch (in Steam)
	* Origin (in Lutris)
	* Battle_net (in Lutris)
	* Uplay (in Lutris)
	* Teknoparrot (in Lutris)
* Fix game metadata (see [dedicated document](./resources/fixing_game_metadata.md))
* Regroup duplicate games entries (eg. PPSSPP & Retroarch) into a "multiple source game"
