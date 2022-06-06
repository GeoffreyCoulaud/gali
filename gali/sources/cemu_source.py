import yaml
import sqlite3
from math import inf
from locale import getlocale, LC_MESSAGES
from pathlib import PurePath
from xml.etree.ElementTree import ElementTree

from gali.utils.locations import HOME
from gali.sources.emulation_source import EmulationSource
from gali.utils.rpx_metadata import RPXMetadata
from gali.games.cemu_game import CemuLutrisGame
from gali.sources.lutris_source import LutrisSource
from gali.utils.wine_path import wine_to_posix
from gali.sources.game_dir import GameDir

class CemuLutrisSource(EmulationSource):

	name : str = "Cemu (Lutris)"
	game_class : type[CemuLutrisGame] = CemuLutrisGame
	rom_extensions : tuple[str] = (".wud", ".wux", ".wad", ".iso", ".rpx", ".elf")

	def get_cemu_lutris_config(self) -> dict:

		# Get path to lutris config for cemu
		connection = sqlite3.connect(LutrisSource.db_path)
		sql = "SELECT configpath FROM 'games' WHERE slug = 'cemu'"
		cursor = connection.execute(sql)
		row = cursor.fetchone()
		connection.close()
		config_path = f"{HOME}/.config/lutris/games/{row[0]}.yml"

		# Get config content
		file = open(config_path, "r", encoding="utf-8-sig")
		config = yaml.safe_load(file)
		file.close()
		return config

	def get_cemu_config(self, cemu_exe_path) -> ElementTree:
		config_dir = PurePath(cemu_exe_path).parent
		config_path = f"{config_dir}/settings.xml"
		config = ElementTree()
		config.parse(config_path)
		return config

	def get_cached_games(self, wine_prefix_path: str, config: ElementTree) -> tuple[CemuLutrisGame]:
		
		games = []

		# Read XML tree
		elements = config.findall("./GameCache/Entry")
		for element in elements:

			# Get game data
			name = element.findtext("name", default=None)
			game_path = element.findtext("path", default=None)
			if name is None or game_path is None:
				continue

			# Convert wine path to posix
			game_path = wine_to_posix(wine_prefix_path, game_path)

			# Build game
			game = self.game_class(
				name=name,
				game_path=game_path
			)
			games.append(game)

		return tuple(games)

	def get_rom_dirs(self, wine_prefix_path: str, config : ElementTree) -> tuple[str]:
		game_dirs = []
		elements = config.findall("./GamePaths/Entry")
		for element in elements:
			path = wine_to_posix(wine_prefix_path, element.text)
			print(path) # ! DEBUG
			game_dir = GameDir(path, inf)
			game_dirs.append(game_dir)
		return tuple(game_dirs)

	def get_rom_games(self, rom_dirs : tuple[str]) -> tuple[CemuLutrisGame]:

		games = []

		# Get locale language (for rpx games)
		locale = getlocale(LC_MESSAGES)
		locale_lang_code = locale[0]
		if locale_lang_code is not None:
			locale_lang_code = locale_lang_code[0:2]
			locale_lang_code = locale_lang_code.lower()

		# Scan every rom dir
		for rom_dir in rom_dirs:

			# Scan for roms
			try:
				rom_paths = self.get_rom_paths(rom_dir, self.rom_extensions)
				pass
			except Exception:
				continue

			# Build games from roms
			for rom_path in rom_paths:
				pure_path = PurePath(rom_path)
				extension = pure_path.suffix
				basename = pure_path.stem

				# Special case for metadata-rich ".rpx" games
				if extension == ".rpx":
					metadata : RPXMetadata = RPXMetadata.from_rom_path(rom_path)
					name = metadata.long_name.get(locale_lang_code, basename)
					game = self.game_class(name=name, game_path=rom_path)
					games.append(game)

				# Other games
				else:
					game = self.game_class(name=basename, game_path=rom_path)
					games.append(game)

		return games

	def scan(self) -> list[CemuLutrisGame]:

		# Read lutris config for cemu
		cemu_lutris_config = self.get_cemu_lutris_config()
		wine_prefix_path = cemu_lutris_config["game"]["prefix"]
		exe_path = cemu_lutris_config["game"]["exe"]
		exe_path = f"{wine_prefix_path}/{exe_path}"

		# Read cemu's config
		cemu_config = self.get_cemu_config(exe_path)

		# Scan for games
		if self.prefer_cache:
			games = self.get_cached_games(wine_prefix_path, cemu_config)
		else:
			game_dirs = self.get_rom_dirs(wine_prefix_path, cemu_config)
			games = self.get_rom_games(game_dirs)
		return games