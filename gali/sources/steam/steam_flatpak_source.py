from gali.sources.steam.steam_source import SteamSource
from gali.utils.locations import HOME


class SteamFlatpakSource(SteamSource):

    name: str = "Steam (Flatpak)"
    steam_dir: str = f"{HOME}/.var/app/com.valvesoftware.Steam/.local/share/Steam"
