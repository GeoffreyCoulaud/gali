from math import inf

from gali.sources.game_dir import GameDir
from gali.sources.source import Source
from gali.games.desktop_game import DesktopGame
from gali.utils.locations import XDG_DATA_DIRS, USER_DIR
from gali.utils.deep_find_files import deep_find_files
from gali.utils.explicit_config_parser import ExplicitConfigParser

class DesktopSource(Source):

	name: str = "Desktop Entries"
	game_class: type[DesktopGame] = DesktopGame
	extensions: tuple[str] = (".desktop",)

	def get_desktop_dirs(self) -> tuple[GameDir]:
		# FIXME - Find a way to read real XDG_DATA_DIRS in flatpak
		dirs = []
		for XDG_DATA_DIR in XDG_DATA_DIRS:
			dirs.append(f"{XDG_DATA_DIR}/applications")
		dirs.append(f"{USER_DIR}/.local/share/applications")
		dirs.append("/usr/share/applications")
		dirs.append("/usr/local/share/applications")
		return tuple(dirs)

	def get_desktop_paths(self, desktop_dirs) -> tuple[str]:
		desktop_paths = []
		for root_dir in desktop_dirs:
			try:
				found = deep_find_files(root_dir, inf, self.extensions)
			except Exception as err:
				continue
			desktop_paths.extend(found)
		return tuple(desktop_paths)

	def get_desktop_games(self, desktop_paths) -> tuple[DesktopGame]:
		
		games = []

		for path in desktop_paths:
			
			# Read desktop entry data
			data = ExplicitConfigParser()
			try:
				data.read(path)
			except:
				continue
			
			# Filter out hidden entries
			hidden = data.getboolean("Desktop Entry", "Hidden", fallback=False)
			if hidden:
				continue
			no_display = data.getboolean("Desktop Entry", "NoDisplay", fallback=False)
			if no_display:
				continue

			# Filter out entries that are not games
			categories = data.get("Desktop Entry", "Categories", fallback="")
			categories = categories.split(";")
			if not ("Game" in categories):
				continue

			# Build game
			name = data.get("Desktop Entry", "Name")
			exec_str = data.get("Desktop Entry", "Exec", raw=True)
			game = self.game_class(
				name=name,
				exec_str=exec_str
			)
			games.append(game)

		return tuple(games)

	def scan(self) -> list[DesktopGame]:
		dirs = self.get_desktop_dirs()
		paths = self.get_desktop_paths(dirs)
		# ! DEBUG
		for path in paths:
			print(path)
		games = self.get_desktop_games(paths)
		return games
