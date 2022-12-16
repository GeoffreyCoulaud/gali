from gi.repository import GObject
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
