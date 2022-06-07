import sys
from traceback import print_tb

from gali.games.game import Game
from gali.sources.source import Source
from gali.sources.all_sources import all_sources


class Library():
    """A class representing a multi-source game library"""

    games: list[Game] = []
    sources: list[type[Source]] = []
    enabled_source_names: list[str] = []

    def __init__(self, enabled_source_names: list[str]) -> None:
        self.enabled_sources_names = enabled_source_names

    def empty(self) -> None:
        """Empty the library"""
        self.games.clear()

    def scan(self) -> None:
        """Scan the library sources"""
        self.empty()
        for klass in all_sources:
            if not (klass.name in self.enabled_sources_names):
                continue
            source = klass()
            print(f"Scanning source \"{source.name}\"")
            try:
                games = source.scan()
            except Exception as err:
                print(f"Error while scanning {source.name}")
                print_tb(sys.exc_info()[2])
                print(err)
            else:
                self.games.extend(games)
        print("Scan finished")

    def print(self) -> None:
        """Print the games in the library to stdout"""
        for game in self.games:
            print(f"* {str(game)}")
