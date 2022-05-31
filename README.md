# GALI

![GitHub](https://img.shields.io/github/license/GeoffreyCoulaud/gali?style=for-the-badge)
![GitHub last commit](https://img.shields.io/github/last-commit/GeoffreyCoulaud/gali?style=for-the-badge)

A game launcher for **linux** where your library is the star of the show.

## Why ?
> I'm so tired of interfaces that include 9 out of 10 of my games. I want it all in one, pretty, place ! 

If you think alike, I believe Gali is for you. 

However, if you want a single place to install, configure and manage your games, 
this is not the intended purpose of Gali. This project is made to display your games library. 
You will have to install other software to manage your games, they will definitely do it better.

## Supported sources
As of 2022-05-30

Status   | Name                               | Description                                
-------- | ---------------------------------- | -----------------------------------------
✅       | Dolphin                            | Nintendo Wii / GameCube emulator
✅       | Dolphin (flatpak)                  | -
✅       | PPSSPP                             | Sony PSP emulator
✅       | PPSSPP (flatpak)                   | -
✅ (4)   | Desktop entries                    | Regular linux desktop entries
✅ (3,1) | Heroic                             | FOSS Epic Games Launcher alternative (GUI)
✅ (3,1) | Heroic (flatpak)                   | -
🔶 (2)   | Citra                              | Nintendo 3DS emulator
🔶 (2)   | Citra (flatpak)                    | -
🔶 (2)   | Yuzu                               | Nintendo Switch emulator
🔶 (2)   | Yuzu (flatpak)                     | -
❌ (3,1) | Steam                              | PC games store
❌ (3,1) | Steam (flatpak)                    | -
❌ (3,1) | Legendary                          | FOSS Epic Games Launcher alternative (CLI)
❌ (3)   | Lutris                             | Open Source gaming platform for Linux
❌ (3)   | Retroarch                          | Frontend for the libretro API
❌ (3)   | Retroarch (flatpak)                | -
❌ (3)   | Cemu                               | Nintendo Wii U emulator

1. **Steam**, **Legendary** and **Heroic** only allow starting games, not stopping or killing them
2. **Citra** and **Yuzu** installed games are not scanned (only roms are scanned)
3. Was previously implemented in Node JS, is to be ported to python.
4. Not available in Flatpak.  
In flatpak's sandbox it is not possible to get desktop entries from `/var/lib/flatpak/exports/share`, so none of the system-wide flatpak desktop entries are scanned. See [xdg-desktop-portal#809](https://github.com/flatpak/xdg-desktop-portal/issues/809) for a possible solution.

## Usage
**This is in active development but is just not there yet. Be patient !**

### Dev usage
Open the project in Gnome Builder, build and start from there.

## Known issues
* Games from Steam, Legendary, Heroic can be started but not stopped or killed
* Cemu in lutris is a clunky solution, but it's the best we currently have on linux

## TODO
* App UI
* Dolphin : Scan cached games
* Dolphin : Differenciate between Gamecube and Wii games
* Yuzu : Scan installed games
* Citra : Scan installed games
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
