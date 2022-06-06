import vdf
import os
import re

from gali.sources.game_dir import GameDir
from gali.sources.source import Source
from gali.games.steam_game import SteamGame
from gali.utils.locations import HOME

def fullmatch_any(value: str, patterns: tuple[re.Pattern]) -> bool:
	"""Test if a string matches any regex in a tuple"""
	for pattern in patterns:
		if pattern.fullmatch(value):
			return True
	return False

class SteamSource(Source):

	name : str = "Steam"
	game_class : type[SteamGame] = SteamGame
	steam_dir : str = f"{HOME}/.local/share/Steam"
	rel_library_config : str = "config/libraryfolders.vdf"
	rel_image_cache : str = "appcache/librarycache"

	def get_library_config(self) -> dict:
		path = f"{self.steam_dir}/{self.rel_library_config}"
		try:
			with open(path, "r", encoding="utf-8-sig") as file:
				config = vdf.load(file)
		except Exception as err:
			raise err
		else:
			return config

	def get_game_dirs(self, config: dict) -> tuple[str]:
		paths = []
		library_folders = config["libraryfolders"]
		if library_folders is None:
			raise KeyError()
		for key in library_folders:
			entry = library_folders[key]
			path = entry.get("path", None)
			if path is None:
				continue
			paths.append(path)
		return tuple(paths)

	def get_games(self, game_dirs: tuple[str]) -> tuple[SteamGame]:

		IGNORED_APPIDS = (221410, 228980, 1070560)
		IGNORED_REGEXES = (
			re.compile("^Steamworks.*"),
			re.compile("^(S|s)team ?(L|l)inux ?(R|r)untime.*"),
			re.compile("^Proton.*"),
		)

		# Get all manifest paths
		manifests = []
		for game_dir in game_dirs:

			# Test if dir is scannable
			path = f"{game_dir}/steamapps"
			if not os.access(path, os.R_OK):
				continue

			# Scan dir
			for dirent in os.scandir(path):
				if not dirent.is_file():
					continue
				if not dirent.name.startswith("appmanifest_"):
					continue
				if not dirent.name.endswith(".acf"):
					continue
				manifests.append(dirent.path)

		games = []

		# Read manifests
		for manifest in manifests:
			
			# Get data
			try:
				with open(manifest, "r", encoding="utf-8-sig") as file:
					data = vdf.load(file)
			except Exception as err:
				raise err

			# Get interesting info
			INSTALLED_MASK = 4
			app_state = data.get("AppState", None)
			if app_state is None:
				continue
			state_flags = int(app_state.get("StateFlags", 0))
			app_id = app_state.get("appid", None)
			name = app_state.get("name", None)
			is_installed = state_flags & INSTALLED_MASK
			if (app_id is None) or (name is None):
				continue

			# Skip known non-games
			if app_id in IGNORED_APPIDS:
				continue
			if fullmatch_any(name, IGNORED_REGEXES):
				continue

			# Build game
			game = self.game_class(
				name=name,
				app_id=app_id,
				is_installed=is_installed
			)

			# If an existing game has the same app id, 
			# if the new is installed and not the old, 
			# remove the old.
			for (i, old) in enumerate(games):
				if (
					(old.app_id == game.app_id) and 
					(not old.is_insalled) and 
					game.is_installed
				):
					del games[i]

			games.append(game)

		return games

	def scan(self) -> list[SteamGame]:
		config = self.get_library_config()
		game_dirs = self.get_game_dirs(config)
		games = self.get_games(game_dirs)
		return games

class SteamFlatpakSource(SteamSource):

	name : str = "Steam (Flatpak)"
	steam_dir : str = f"{HOME}/.var/app/com.valvesoftware.Steam/.local/share/Steam"