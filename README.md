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
* Cemu in lutris games get named after their ROM's filename (unpacked games are fine)
* Dolphin emulator games don't get distinguished between GameCube and Wii
* Installed Citra games aren't supported
* Installed Yuzu games aren't supported

## TODO
* Retroarch support
* Get icon paths for all game types
* Start method for all game types
* Launcher UI