from gali.sources.legendary.legendary_source import LegendarySource
from gali.sources.legendary.native.legendary_native_game import LegendaryNativeGame
from gali.utils.locations import HOME


class LegendaryNativeSource(LegendarySource):

    name: str = "Legendary"
    game_class: type[LegendaryNativeGame] = LegendaryNativeGame
    config_path: str = f"{HOME}/.config/legendary/config.ini"
    default_install_dir: str = f"{HOME}/.config/legendary"