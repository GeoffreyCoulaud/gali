import sys
from traceback import print_tb
from gi.repository import Gio, GObject

from gali.sources.source import Source
from gali.sources.all_sources import all_sources
from gali.games.game import Game


class GameGObject(GObject.GObject):
    """A GObject wrapper around Gali games for use with GTK"""
    __gtype_name__ = "GameGObject"

    game: Game = None

    def __init__(self, game):
        GObject.GObject.__init__(self)
        self.game = game

    def __str__(self):
        return str(self.game)


class Library():
    """A class representing a multi-source game library"""

    games: list[Game] = []
    sources: list[type[Source]] = []
    
    gio_list_store: Gio.ListStore

    def __init__(self):
        self.gio_list_store = Gio.ListStore(item_type=GameGObject)

    def empty(self) -> None:
        """Empty the library"""
        self.games.clear()
        self.gio_list_store.remove_all()

    def add_games(self, games: tuple[Game]):
        """Add games to the library"""
        self.games.extend(games)
        store_items = list(map(lambda g: GameGObject(g), games))
        store_len = self.gio_list_store.get_n_items()
        self.gio_list_store.splice(store_len, 0, store_items)

    def scan(self) -> None:
        """Scan the library sources"""
        # TODO Scan in a different thread
        self.empty()
        for klass in all_sources:
            source = klass()
            is_scannable = source.is_scannable() 
            if not is_scannable :
                print(f"🚫 Skipping source {source.name} : {str(is_scannable)}")
                continue
            print(f"🔍 Scanning source {source.name}")
            try:
                games = source.scan()
            except Exception as err:
                print(f"Error while scanning {source.name}")
                print_tb(sys.exc_info()[2])
                print(err)
            else:
                self.add_games(games)
        print("Scan finished")

    def print(self) -> None:
        """Print the games in the library to stdout"""
        for game in self.games:
            print(f"* {str(game)}")