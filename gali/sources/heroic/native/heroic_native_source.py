import json

from gali.utils.locations import HOME
from gali.sources.source import Source
from gali.sources.heroic.heroic_xdg_game import HeroicXDGGame
from gali.sources.file_dependent_scannable import FileDependentScannable


class HeroicNativeSource(Source, FileDependentScannable):

    name: str = "Heroic"
    game_class: type[HeroicXDGGame] = HeroicXDGGame
    config_path: str = f"{HOME}/.config/heroic/lib-cache/library.json"

    def get_config(self) -> dict:
        try:
            with open(self.config_path, "r", encoding="utf-8-sig") as file:
                config = json.load(file)
        except Exception as err:
            raise err
        else:
            return config

    def get_games(self, config: dict) -> tuple[HeroicXDGGame]:

        games = []
        library = config["library"]

        for entry in library:

            # Ignore non-games
            is_game = entry.get("is_game", False)
            if not is_game:
                continue

            # Skip broken entries
            name = entry.get("title", None)
            app_name = entry.get("app_name", None)
            if name is None or app_name is None:
                continue

            # Build games
            is_installed = entry.get("is_installed", True)
            game = self.game_class(
                name=name,
                app_name=app_name,
                is_installed=is_installed
            )
            games.append(game)

        return tuple(games)

    def scan(self) -> tuple[HeroicXDGGame]:
        config = self.get_config()
        games = self.get_games(config)
        return games

    def get_precondition_file_path(self):
        return self.config_path
