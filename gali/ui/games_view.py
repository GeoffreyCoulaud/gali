from gi.repository import Adw, Gtk, Gio
from gali.ui.game_gobject import GameGObject
from gali.ui.string_list_item_factory import StringListItemFactory
from gali.games.game import Game


class GamesView(Gtk.ScrolledWindow):

    def __init__(self, games_list_store):
        super().__init__()

        # List selection model
        list_selection_model = Gtk.NoSelection()
        list_selection_model.set_model(games_list_store)

        # List factory
        list_factory = StringListItemFactory()

        # List view
        list_view = Gtk.ListView()
        list_view.set_model(list_selection_model)
        list_view.set_factory(list_factory)
        self.set_child(list_view)