from gali.sources.steam.steam_source import SteamSource
from gali.sources.steam.steam_xdg_game import SteamXDGGame
from gali.utils.locations import HOME


class SteamNativeSource(SteamSource):

    name: str = "Steam"
    game_class: type[SteamXDGGame] = SteamXDGGame
    steam_dir: str = f"{HOME}/.local/share/Steam"