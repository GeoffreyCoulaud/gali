from gali.sources.game import Game
from gali.sources.scannable import Scannable

class Source(Scannable):

    name: str
    game_class: type[Game]
    prefer_cache: bool = False