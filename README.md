# game-launcher
 WIP game launcher for linux

## Supported sources
* Steam (Linux and Windows through Proton games) (only installed games)
* Lutris (Windows games through Wine) (only installed games)
* Dolphin emulator (Nintendo GameCube + Wii)
* Citra (Nintendo 3DS)
* Yuzu (Nintendo Switch)
* Cemu (Nintendo Wii U) (through Lutris)
* Retroarch (Frontend for emulators)

## Known issues
* Emulated games are named after their ROM's filename (Dolphin, Cemu, PPSSPP)
* Dolphin emulator games don't get distinguished between GameCube and Wii
* Installed Citra games aren't supported
* Installed Yuzu games aren't supported

## TODO
* Legendary launcher support
* Start method for all game types
* Get icons (box art) for all game types
* Launcher UI
* Fix game naming for ROMs
* Regroup games that have the same name into a "multiple source game"