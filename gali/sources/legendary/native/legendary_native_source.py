import json

from gali.utils.locations import HOME
from gali.sources.source import Source
from gali.sources.legendary.native.legendary_native_game import LegendaryNativeGame
from gali.utils.explicit_config_parser import ExplicitConfigParser
from gali.sources.file_dependent_scannable import FileDependentScannable


class LegendaryNativeSource(Source, FileDependentScannable):

    name: str = "Legendary"
    game_class: type[LegendaryNativeGame] = LegendaryNativeGame
    config_path: str = f"{HOME}/.config/legendary/config.ini"
    default_install_dir: str = f"{HOME}/.config/legendary"

    def get_config(self) -> ExplicitConfigParser:
        config = ExplicitConfigParser()
        config.read(self.config_path)
        return config

    def get_installed_json(self, config: ExplicitConfigParser) -> dict:

        # Get path to installed.json
        path = config.get(
            "Legendary",
            "install_dir",
            fallback=self.default_install_dir
        )
        path = f"{path}/installed.json"

        # Read installed.json
        try:
            with open(path, "r", encoding="utf-8-sig") as file:
                config = json.load(file)
        except Exception as err:
            raise err
        else:
            return config

    def get_games(self, installed_json: dict) -> tuple[LegendaryNativeGame]:

        games = []

        for key in installed_json:
            entry = installed_json[key]

            # Skip DLCs
            is_dlc = entry.get("is_dlc", False)
            if is_dlc:
                continue

            # Skip broken entries
            name = entry.get("title", None)
            app_name = entry.get("app_name", None)
            if name is None or app_name is None:
                continue

            # Build games
            game = self.game_class(
                name=name,
                app_name=app_name
            )
            games.append(game)

        return tuple(games)

    def scan(self) -> tuple[LegendaryNativeGame]:
        config = self.get_config()
        installed_json = self.get_installed_json(config)
        games = self.get_games(installed_json)
        return games

    def get_precondition_file_path(self):
        return self.config_path
