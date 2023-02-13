from gali.sources.dolphin.dolphin_source import DolphinSource
from gali.sources.dolphin.dolphin_flatpak_game import DolphinFlatpakGame
from gali.utils.locations import HOME


class DolphinFlatpakSource(DolphinSource):

    name: str = "Dolphin (Flatpak)"
    game_class: type[DolphinFlatpakGame] = DolphinFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.DolphinEmu.dolphin-emu/config/dolphin-emu/Dolphin.ini"