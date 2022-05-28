from math import inf
from pathlib import PurePath

from gali.utils.explicit_config_parser import ExplicitConfigParser
from gali.utils.locations import USER_DIR
from gali.sources.game_dir import GameDir
from gali.sources.emulation_source import EmulationSource
from gali.games.dolphin_game import DolphinGame, DolphinFlatpakGame

class DolphinSource(EmulationSource):

	name : str = "Dolphin"
	game_class : type[DolphinGame] = DolphinGame
	config_path : str = f"{USER_DIR}/.config/dolphin-emu/Dolphin.ini"
	rom_extensions : tuple[str] = (".ciso", ".iso", ".wbfs", ".gcm", ".gcz")

	def get_config(self) -> ExplicitConfigParser:
		config = ExplicitConfigParser()
		config.read(self.config_path, encoding="utf-8-sig")
		return config

	def get_rom_dirs(self, config: ExplicitConfigParser) -> list[GameDir]:
		rom_dirs = []
		n_dirs = config.getint("General", "ISOPaths", fallback=0)
		deep = config.getboolean("General", "RecursiveISOPaths", fallback=False)
		depth = inf if deep else 0
		for i in range(n_dirs):
			path = config.get("General", f"ISOPath{i}", fallback=None)
			if path is None:
				continue
			rom_dirs.append(GameDir(path, depth))
		return rom_dirs

	def get_rom_games(self, rom_dirs: list[GameDir]) -> list[DolphinGame]:
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
		return games

	def scan(self) -> list[DolphinGame]:
		config = self.get_config()
		rom_dirs = self.get_rom_dirs(config)
		rom_games = self.get_rom_games(rom_dirs)
		return rom_games

class DolphinFlatpakSource(DolphinSource):

	name           : str               = "Dolphin (Flatpak)"
	game_class     : type[DolphinGame] = DolphinFlatpakGame
	config_path    : str               = f"{USER_DIR}/.var/app/org.DolphinEmu.dolphin-emu/config/dolphin-emu/Dolphin.ini"