from gali.sources.itch.native.itch_native_game import ItchNativeGame
from gali.sources.itch.itch_source import ItchSource
from gali.utils.locations import HOME


class ItchNativeSource(ItchSource):

    name: str = "Itch"
    game_class: type[ItchNativeGame] = ItchNativeGame
    db_path: str = f"{HOME}/.config/itch/db/butler.db"