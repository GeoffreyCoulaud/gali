# game-launcher
 WIP game launcher for linux

## Supported sources
* Steam (Linux and Windows through Proton games) (only installed games)
* Lutris (Windows games through Wine) (only installed games)
* Dolphin emulator (Nintendo GameCube + Wii)
* Citra (Nintendo 3DS)
* Yuzu (Nintendo Switch)
* Cemu (Nintendo Wii U) (through Lutris)

## Known issues
* Dolphin emulator games get named after their ROM's filename
* Dolphin emulator games don't get distinguished between GameCube and Wii
* Installed Citra games aren't supported
* Installed Yuzu games aren't supported
* Cemu scanner isn't fully implemented. Reading from game cache is implemented but discovering from disk is not.

## TODO
* Start method for all game types
* Launcher UI
* Retroarch support