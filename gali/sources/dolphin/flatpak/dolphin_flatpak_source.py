from gali.sources.dolphin.native.dolphin_native_source import DolphinNativeSource
from gali.sources.dolphin.flatpak.dolphin_flatpak_game import DolphinFlatpakGame
from gali.utils.locations import HOME


class DolphinFlatpakSource(DolphinNativeSource):

    name: str = "Dolphin (Flatpak)"
    game_class: type[DolphinFlatpakGame] = DolphinFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.DolphinEmu.dolphin-emu/config/dolphin-emu/Dolphin.ini"