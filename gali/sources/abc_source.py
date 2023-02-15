from gali.sources.abc_game import ABCGame
from gali.sources.abc_scannable import ABCScannable

class ABCSource(ABCScannable):

    name: str
    game_class: type[ABCGame]
    prefer_cache: bool = False