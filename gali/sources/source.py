from gali.games.game import Game


class Source():

    name: str = None
    game_class: type[Game] = None
    prefer_cache: bool = False

    def __init__(self) -> None:
        pass

    def scan(self) -> tuple[Game]:
        """Scan the source for games"""
        pass
