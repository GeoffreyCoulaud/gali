import re
from math import inf
from pathlib import PurePath

from gali.utils.explicit_config_parser import ExplicitConfigParser
from gali.utils.locations import HOME
from gali.sources.emulation_source import EmulationSource
from gali.sources.game_dir import GameDir
from gali.games.ppsspp_game import PPSSPPGame, PPSSPPFlatpakGame

class PPSSPPSource(EmulationSource):

	name : str = "PPSSPP"
	game_class : type[PPSSPPGame] = PPSSPPGame
	config_path : str = f"{HOME}/.config/ppsspp/PSP/SYSTEM/ppsspp.ini"
	rom_extensions : tuple[str] = (".iso", ".cso")

	def get_config(self) -> ExplicitConfigParser:
		config = ExplicitConfigParser()
		config.read(self.config_path, encoding="utf-8-sig")
		return config

	def get_rom_dirs(self, config: ExplicitConfigParser) -> tuple[GameDir]:
		rom_dirs = []
		items = config.items("PinnedPaths")
		for (key, path) in items: 
			rom_dirs.append(GameDir(path, 0))
		return tuple(rom_dirs)

	def get_rom_games(self, rom_dirs: tuple[GameDir]) -> tuple[PPSSPPGame]:
		games = []
		for rom_dir in rom_dirs:
			rom_paths = []
			try:
				rom_paths = self.get_rom_paths(rom_dir, self.rom_extensions)
			except Exception as err:
				rom_paths = []
			for path in rom_paths:
				name = PurePath(path).name
				game = self.game_class(
					name=name, 
					game_path=path,
					is_installed=True,
				)
				games.append(game)
		return tuple(games)

	def scan(self) -> list[PPSSPPGame]:
		config = self.get_config()
		rom_dirs = self.get_rom_dirs(config)
		rom_games = self.get_rom_games(rom_dirs)
		return rom_games

class PPSSPPFlatpakSource(PPSSPPSource):

	name : str = "PPSSPP (Flatpak)"
	game_class : type[PPSSPPFlatpakGame] = PPSSPPFlatpakGame
	config_path : str = f"{HOME}/.var/app/org.ppsspp.PPSSPP/config/ppsspp/PSP/SYSTEM/ppsspp.ini"