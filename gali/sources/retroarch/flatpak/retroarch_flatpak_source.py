from gali.sources.retroarch.flatpak.retroarch_flatpak_game import RetroarchFlatpakGame
from gali.sources.retroarch.retroarch_source import RetroarchSource
from gali.utils.locations import HOME


class RetroarchFlatpakSource(RetroarchSource):

    name: str = "Retroarch (Flatpak)"
    game_class: type[RetroarchFlatpakGame] = RetroarchFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.libretro.RetroArch/config/retroarch/retroarch.cfg"