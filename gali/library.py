import sys
from traceback import print_tb
from gi.repository import Gio, GObject

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


class Library():
    """A class representing a multi-source game library"""

    _source_games_map: dict[type[Source], list[Game]] = dict()
    _hidden_sources: set[type[Source]] = set()
    
    # View containing the games to display in the UI
    gio_list_store: Gio.ListStore

    def __init__(self):
        self.gio_list_store = Gio.ListStore(item_type=GameGObject)
        for klass in all_sources:
            self._source_games_map[klass] = list()

    def __iter__(self):
        """Iterate over the library's games.
        No order is guaranteed."""
        for games in self._source_games_map.values():
            for game in games:
                yield game

    def _update_gio_list_store(self):
        """Update the GioListStore with the games in the library. 
        Private method, called on contents change."""
        # TODO don't rebuild, only apply delta
        self.gio_list_store.remove_all()
        for (klass, games) in self._source_games_map.items():
            if klass in self._hidden_sources: continue
            store_items = list()
            for game in games: store_items.append(GameGObject(game))
            store_len = self.gio_list_store.get_n_items()
            self.gio_list_store.splice(store_len, 0, store_items)

    def clear(self) -> None:
        """Empty the library"""
        for klass in self._source_games_map.keys():
            self._source_games_map[klass].clear()
        self.gio_list_store.remove_all()

    def append(self, klass: type[Source], *games: Game):
        """Add games from a given source to the library"""
        self._source_games_map[klass].extend(games)
        self._update_gio_list_store()

    def hide_source(self, klass: type[Source]):
        """Hide a source in the view"""
        self._hidden_sources.add(klass)
        self._update_gio_list_store()

    def show_source(self, klass: type[Source]):
        """Show a source in the view"""
        if klass not in self._hidden_sources: return
        self._hidden_sources.remove(klass)
        self._update_gio_list_store()

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
                self.append(klass, *games)
        print("Scan finished")

    def print(self) -> None:
        """Print the games in the library to stdout"""
        for game in self:
            print(f"* {str(game)}")