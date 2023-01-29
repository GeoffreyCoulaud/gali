import sys
from traceback import print_tb
from gi.repository import Gio, GObject
from typing import Iterable 

from gali.sources.source import Source
from gali.sources.all_sources import all_sources
from gali.games.game import Game


class GameGObject(GObject.GObject):
    """A GObject wrapper around Gali games for use with GTK"""
    __gtype_name__ = "GameGObject"

    game: Game

    def __init__(self, game):
        GObject.GObject.__init__(self)
        self.game = game

    def __str__(self):
        return str(self.game)

    def get_game_type(self):
        return type(self.game)


class GamesListStore(Gio.ListStore):
    """A GioListStore that exclusively stores items of type GameGObject"""

    __gtype_name__ = "GamesListStore"

    def __init__(self) -> None:
        super().__init__(item_type=GameGObject)

    def extend(self, games: Iterable[Game]):
        """Add multiple games to itself.
        Will only emit `Gio.ListModel::items-changed` once."""
        store_len = self.get_n_items()
        items = list(map(lambda g: GameGObject(g), games))
        self.splice(store_len, 0, items)
    
    def remove_of_type(self, _type: type):
        """Remove all the GameGObjects wrapping a game of the given type.
        Will emit multiple `Gio.ListModel::items-changed`"""
        index = 0
        while index < self.get_n_items():
            game = self.get_item(index)
            if game.get_game_type() == _type:
                self.remove(index)
                continue
            index += 1


class Library():
    """A class representing a multi-source game library"""

    _source_games_map: dict[type[Source], list[Game]] = dict()
    _hidden_sources: set[type[Source]] = set()
    
    # View containing the games to display in the UI
    gio_list_store: GamesListStore

    def __init__(self):
        self.gio_list_store = GamesListStore()
        for klass in all_sources:
            self._source_games_map[klass] = list()

    def __iter__(self):
        """Iterate over the library's games.
        No order is guaranteed."""
        for games in self._source_games_map.values():
            for game in games:
                yield game

    def clear(self) -> None:
        """Empty the library"""
        for klass in self._source_games_map.keys():
            self._source_games_map[klass].clear()
        self.gio_list_store.remove_all()

    def extend(self, klass: type[Source], games: Iterable[Game]):
        """Add games from a given source to the library"""
        self._source_games_map[klass].extend(games)
        self.gio_list_store.extend(games)

    def hide_source(self, klass: type[Source]):
        """Hide a source in the view""" 
        self._hidden_sources.add(klass)
        self.gio_list_store.remove_of_type(klass.game_class)

    def show_source(self, klass: type[Source]):
        """Show a source in the view"""
        if klass not in self._hidden_sources: return
        self._hidden_sources.remove(klass)
        games = self._source_games_map[klass]
        self.gio_list_store.extend(games)

    def scan(self) -> None:
        """Scan the library sources"""
        # TODO Non-blocking sources scans
        self.clear()
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
                self.extend(klass, games)
        print("Scan finished")

    def print(self) -> None:
        """Print the games in the library to stdout"""
        for game in self:
            print(f"* {str(game)}")