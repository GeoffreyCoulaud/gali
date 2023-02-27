# GALI

A game launcher for **linux** where your library is the star of the show.


> I'm so tired of launchers that each have 20% of my games.  
I want to view them all in the same place !

If you think alike, Gali is for you.

However, gali is **not** 

* A game manager that handles downloading, managing, uninstalling
* A general-purpose app launcher
* A replacement for other game launchers
* A compatibility layer
* A windows app

## Supported sources

<table>
	<thead>
		<tr>
			<th>Status</th>
			<th>Variants</th>
			<th>Name</th>
			<th>Description</th>
			<th>Links</th>
		</tr>
	</thead>
	<tbody>
		<!-- Cemu -->
		<tr>
			<td>✅</td>
			<td>
				<img src="docs/icons/lutris.svg" alt="Lutris" title="Lutris" width="16">
			</td>
			<td>Cemu</td>
			<td>Nintendo Wii U emulator</td>
			<td>
				<a href="https://cemu.info">Website</a> |
				<a href="https://lutris.net/games/cemu/">Lutris</a>
			</td>
		</tr>
		<!-- Citra -->
		<tr>
			<td>✅ (2)</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16"> 
				<img src="docs/icons/flatpak.svg" alt="Flatpak" title="Flatpak" width="16">
			</td>
			<td>Citra</td>
			<td>Nintendo 3DS emulator</td>
			<td>
				<a href="https://citra-emu.org/">Website</a> |
				<a href="https://flathub.org/apps/details/org.citra_emu.citra">Flathub</a>
			</td>
		</tr>
		<!-- Desktop entries -->
		<tr>
			<td>✅ (3)</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16">
			</td>
			<td>Desktop entries</td>
			<td>Regular linux desktop entries</td>
			<td>
				<a href="https://specifications.freedesktop.org/desktop-entry-spec/desktop-entry-spec-latest.html">Specification</a>
			</td>
		</tr>
		<!-- Dolphin -->
		<tr>
			<td>✅</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16"> 
				<img src="docs/icons/flatpak.svg" alt="Flatpak" title="Flatpak" width="16">
			</td>
			<td>Dolphin</td>
			<td>Nintendo Wii / GameCube emulator</td>
			<td>
				<a href="https://dolphin-emu.org">Website</a> |
				<a href="https://flathub.org/apps/details/org.DolphinEmu.dolphin-emu">Flathub</a>
			</td>
		</tr>
		<!-- Heroic -->
		<tr>
			<td>✅ (1)</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16"> 
				<img src="docs/icons/flatpak.svg" alt="Flatpak" title="Flatpak" width="16">
			</td>
			<td>Heroic</td>
			<td>FOSS Epic Games Launcher alternative (GUI)</td>
			<td>
				<a href="https://heroicgameslauncher.com/">Website</a> |
				<a href="https://flathub.org/apps/details/com.heroicgameslauncher.hgl">Flathub</a>
			</td>
		</tr>
		<!-- Itch -->
		<tr>
			<td>✅</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16"> 
			</td>
			<td>Itch</td>
			<td>Install, update and play indie games</td>
			<td>
				<a href="https://itch.io/app">Website</a>
			</td>
		</tr>
		<!-- Legendary -->
		<tr>
			<td>✅ (1)</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16">
			</td>
			<td>Legendary</td>
			<td>FOSS Epic Games Launcher alternative (CLI)</td>
			<td>
				<a href="https://github.com/derrod/legendary">Repository</a>
			</td>
		</tr>
		<!-- Lutris -->
		<tr>
			<td>✅</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16">
			</td>
			<td>Lutris</td>
			<td>Open Source gaming platform for Linux</td>
			<td>
				<a href="https://lutris.net">Website</a>
			</td>
		</tr>
		<!-- PPSSPP -->
		<tr>
			<td>✅</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16"> 
				<img src="docs/icons/flatpak.svg" alt="Flatpak" title="Flatpak" width="16">
			</td>
			<td>PPSSPP</td>
			<td>Sony PSP emulator</td>
			<td>
				<a href="https://www.ppsspp.org/">Website</a> |
				<a href="https://flathub.org/apps/details/org.ppsspp.PPSSPP">Flathub</a>
			</td>
		</tr>
		<!-- Retroarch -->
		<tr>
			<td>✅</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16"> 
				<img src="docs/icons/flatpak.svg" alt="Flatpak" title="Flatpak" width="16">
			</td>
			<td>Retroarch</td>
			<td>Frontend for the libretro API</td>
			<td>
				<a href="https://www.retroarch.com/">Website</a> |
				<a href="https://flathub.org/apps/details/org.libretro.RetroArch">Flathub</a>
			</td>
		</tr>
		<!-- Steam -->
		<tr>
			<td>✅ (1)</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16"> 
				<img src="docs/icons/flatpak.svg" alt="Flatpak" title="Flatpak" width="16">
			</td>
			<td>Steam</td>
			<td>PC games store</td>
			<td>
				<a href="https://store.steampowered.com">Website</a> |
				<a href="https://flathub.org/apps/details/com.valvesoftware.Steam">Flathub</a>
			</td>
		</tr>
		<!-- Yuzu -->
		<tr>
			<td>✅ (2)</td>
			<td>
				<img src="docs/icons/tux.svg" alt="Native" title="Native" width="16"> 
				<img src="docs/icons/flatpak.svg" alt="Flatpak" title="Flatpak" width="16">
			</td>
			<td>Yuzu</td>
			<td>Nintendo Switch emulator</td>
			<td>
				<a href="https://yuzu-emu.org">Website</a> |
				<a href="https://flathub.org/apps/details/org.yuzu_emu.yuzu">Flathub</a>
			</td>
		</tr>
	</tbody>
</table>

1. **Steam**, **Legendary** and **Heroic** only allow starting games, not stopping or killing them
2. **Citra** and **Yuzu** installed games are not scanned (only roms are scanned)
3. Not available in Flatpak.
In flatpak's sandbox it is not possible to get desktop entries from `/var/lib/flatpak/exports/share`, so none of the system-wide flatpak desktop entries are scanned. See [xdg-desktop-portal#809](https://github.com/flatpak/xdg-desktop-portal/issues/809) for a possible solution.

### What are these "variants" ?
Some of the supported game sources can be distributed using multiple methods. In that case, the underlying logic is the same but the place where the games are stored and how they are launched may change.

For example, *Retroarch* is distributed in all of these formats:
- Standalone, installed via your distribution's package manager
- Snap, installed from Snapcraft
- Flatpak, installed from Flathub
- Appimage, downloaded manually
- Steam, installed from Steam's client
- Itch.io, installed from Itch.io's website or client

It's still the same source under the hood, so all of these are **variants** of the standalone version.

## Installation

**This is in active development, but not ready. Be patient !**

## Building

TODO : Meson build steps

## TODO

* Continue UI work
* Better documentation (docstrings, wiki)
* Decouple scanning from the main thread
* Add Marie's new icon for Gali 
* Add a preference panel
* Save and load user preferences
* Sources enhancements
	* Scan Dolphin cached games
	* Differenciate between Gamecube and Wii games
	* Scan installed games in Yuzu and Citra
* New sources
	* Bottles
	* itch.io
	* Decaf
	* Ryujinx
	* (Linux native) Cemu
	* (in Steam) Retroarch
	* (in Lutris) Origin
	* (in Lutris) Battle_net
	* (in Lutris) Uplay
	* (in Lutris) Teknoparrot
