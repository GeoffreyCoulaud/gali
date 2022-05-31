import json

from gali.utils.locations import HOME
from gali.sources.source import Source
from gali.games.heroic_game import HeroicGame

class HeroicSource(Source):

	name : str = "Heroic"
	game_class: type[HeroicGame] = HeroicGame
	config_path : str = f"{HOME}/.config/heroic/lib-cache/library.json"

	def get_config(self) -> dict:
		try:
			with open(self.config_path, "r", encoding="utf-8-sig") as file:
				config = json.load(file)
		except Exception as err:
			raise err
		else:
			return config

	def get_games(self, config: dict) -> list[HeroicGame]:
		
		games = []
		library = config["library"]
		
		for entry in library:

			# Ignore non-games
			is_game = entry.get("is_game", False)
			if not is_game:
				continue

			# Build games
			name = entry.get("title", None)
			app_name = entry.get("app_name", None)
			is_installed = entry.get("is_installed", False)
			game = self.game_class(
				name=name, 
				app_name=app_name, 
				is_installed=is_installed
			)
			games.append(game)
		
		return games

	def scan(self) -> list[HeroicGame]:
		config = self.get_config()
		games = self.get_games(config)
		return games

class HeroicFlatpakSource(HeroicSource):

	name : str = "Heroic (Flatpak)"
	game_class: type[HeroicGame] = HeroicGame
	config_path : str = f"{HOME}/.var/app/com.heroicgameslauncher.hgl/config/heroic/lib-cache/library.json"