from gali.sources.lutris.native.lutris_native_game import LutrisNativeGame
from gali.sources.lutris.lutris_source import LutrisSource
from gali.utils.locations import HOME


class LutrisNativeSource(LutrisSource):

    name: str = "Lutris"
    game_class: type[LutrisNativeGame] = LutrisNativeGame
    db_path: str = f"{HOME}/.local/share/lutris/pga.db"