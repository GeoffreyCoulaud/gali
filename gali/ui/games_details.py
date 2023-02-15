from gi.repository import Gtk
from gali.sources.game import Game

@Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/game_details.ui")
class GameDetails(Gtk.Box):
    __gtype_name__ = "GaliGameDetails"

    title = Gtk.Template.Child("name")

    def __init__(self) -> None:
        super().__init__()

    def set_game(self, game: Game) -> None:
        """Set the game displayed"""
        self.title.set_label(game.name)