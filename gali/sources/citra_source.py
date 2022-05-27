from math import inf
from pathlib import PurePath
from configparser import ConfigParser

from gali.sources.emulation_source import EmulationSource
from gali.utils.locations import USER_DIR
from gali.sources.game_dir import GameDir
from gali.games.citra_game import CitraGame

class CitraSource(EmulationSource):

	name = "Citra"

	game_class: type[CitraGame] = CitraGame

	rom_extensions = (".3ds", ".cci")
	config_path = f"{USER_DIR}/.config/citra-emu/qt-config.ini"

	def get_config(self) -> dict:
		config = ConfigParser()
		config.read(self.config_path)
		return config

	def get_rom_dirs(self, config) -> list[GameDir]:
		rom_dirs = []
		n_dirs = config.getint("UI", "Paths\\gamedirs\\size", fallback=0)
		for i in range(1, n_dirs + 1):
			deep = config.getboolean("UI", f"Paths\\gamedirs\\{i}\\deep_scan", fallback=False)
			path = config.get("UI", f"Paths\\gamedirs\\{i}\\path", fallback=None)
			if path is None:
				continue
			if path in ("INSTALLED", "SYSTEM"):
				continue
			depth = inf if deep else 0
			rom_dirs.append(GameDir(path, depth))
		return rom_dirs

	def get_rom_games(self, rom_dirs) -> list[CitraGame]:
		games = []
		for rom_dir in rom_dirs:
			rom_paths = []
			try:
				rom_paths = self.get_rom_paths(rom_dir, self.rom_extensions)
			except Exception as err:
				rom_paths = []
			for path in rom_paths:
				name = PurePath(path).name
				game = self.game_class(name, path)
				games.append(game)
		return games

	def scan(self) -> list[CitraGame]:
		config = self.get_config()
		rom_dirs = self.get_rom_dirs(config)
		rom_games = self.get_rom_games(rom_dirs)
		return rom_games
