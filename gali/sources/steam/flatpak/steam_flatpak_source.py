from gali.sources.steam.native.steam_native_source import SteamNativeSource
from gali.utils.locations import HOME


class SteamFlatpakSource(SteamNativeSource):

    name: str = "Steam (Flatpak)"
    steam_dir: str = f"{HOME}/.var/app/com.valvesoftware.Steam/.local/share/Steam"
