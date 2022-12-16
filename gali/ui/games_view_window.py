from gi.repository import Gtk, Gio
from gali.ui.game_gobject import GameGObject
from gali.ui.string_list_item_factory import StringListItemFactory
from gali.games.game import Game


class GamesViewWindow(Gtk.ScrolledWindow):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # List store
        self.list_store = Gio.ListStore.new(GameGObject)

        # List selection model
        self.list_selection_model = Gtk.NoSelection()
        self.list_selection_model.set_model(self.list_store)

        # List factory
        self.list_factory = StringListItemFactory()

        # List view
        self.list_view = Gtk.ListView()
        self.list_view.set_model(self.list_selection_model)
        self.list_view.set_factory(self.list_factory)

        # Self
        self.set_child(self.list_view)

    def update_games(self, games: tuple[Game]):
        """
        Update the view's games
        """
        items = list(map(lambda g: GameGObject(g), games))
        self.list_store.splice(0, self.list_store.get_n_items(), items)