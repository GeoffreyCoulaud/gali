from gali.sources.retroarch.retroarch_flatpak_game import RetroarchFlatpakGame
from gali.sources.retroarch.retroarch_native_source import RetroarchNativeSource
from gali.utils.locations import HOME


class RetroarchFlatpakSource(RetroarchNativeSource):

    name: str = "Retroarch (Flatpak)"
    game_class: type[RetroarchFlatpakGame] = RetroarchFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.libretro.RetroArch/config/retroarch/retroarch.cfg"