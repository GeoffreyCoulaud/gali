from abc import abstractmethod

from gali.sources.game import Game
from gali.sources.scannable import Scannable

class Source(Scannable):

    name: str = None
    game_class: type[Game] = None
    prefer_cache: bool = False

    def __init__(self) -> None:
        pass

    @abstractmethod
    def scan(self) -> tuple[Game]:
        pass