from gali.sources.dolphin.dolphin_source import DolphinSource
from gali.sources.dolphin.native.dolphin_native_game import DolphinNativeGame
from gali.utils.locations import HOME


class DolphinNativeSource(DolphinSource):

    name: str = "Dolphin"
    game_class: type[DolphinNativeGame] = DolphinNativeGame
    config_path: str = f"{HOME}/.config/dolphin-emu/Dolphin.ini"