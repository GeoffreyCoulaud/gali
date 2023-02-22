from gali.sources.retroarch.native.retroarch_native_game import RetroarchNativeGame
from gali.sources.retroarch.retroarch_source import RetroarchSource
from gali.utils.locations import HOME


class RetroarchNativeSource(RetroarchSource):

    name: str = "Retroarch"
    game_class: type[RetroarchNativeGame] = RetroarchNativeGame
    config_path: str = f"{HOME}/.config/retroarch/retroarch.cfg"