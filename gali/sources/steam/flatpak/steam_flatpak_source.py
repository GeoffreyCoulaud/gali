from gali.sources.steam.steam_source import SteamSource
from gali.sources.steam.steam_xdg_game import SteamXDGGame
from gali.utils.locations import HOME


class SteamFlatpakSource(SteamSource):

    name: str = "Steam (Flatpak)"
    game_class: type[SteamXDGGame] = SteamXDGGame
    steam_dir: str = f"{HOME}/.var/app/com.valvesoftware.Steam/.local/share/Steam"
