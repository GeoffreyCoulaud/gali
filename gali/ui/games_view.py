from gi.repository import Adw, Gtk, Gio
from gali.ui.game_gobject import GameGObject
from gali.ui.string_list_item_factory import StringListItemFactory
from gali.games.game import Game


class GamesView(Gtk.ScrolledWindow):

    list_store = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # List store
        self.list_store = Gio.ListStore.new(GameGObject)

        # List selection model
        list_selection_model = Gtk.NoSelection()
        list_selection_model.set_model(self.list_store)

        # List factory
        list_factory = StringListItemFactory()

        # List view
        list_view = Gtk.ListView()
        list_view.set_model(list_selection_model)
        list_view.set_factory(list_factory)
        self.set_child(list_view)

    def update_games(self, games: tuple[Game]):
        """
        Update the view's games
        """
        items = list(map(lambda g: GameGObject(g), games))
        self.list_store.splice(0, self.list_store.get_n_items(), items)