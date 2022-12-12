from gi.repository import Adw, Gtk, Gio, GObject
from gali.games.game import Game


class GameGObject(GObject.GObject):
    """A wrapper around Gali games to display them with GTK"""

    game: Game = None

    def __init__(self, game):
        GObject.GObject.__init__(self)
        self.game = game


class GaliHeaderBar(Gtk.HeaderBar):
    """Gali's application header bar"""
    __gtype_name__ = "GaliHeaderBar"

    menu_button = None
    menu = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Components

        self.menu_button = Gtk.MenuButton()
        self.menu = Gio.Menu()

        # Assembly

        self.menu.append("Scan Library", "app.scan")
        self.menu.append("Print Library", "app.print_library")
        self.menu.append("Preferences", "app.preferences")
        self.menu.append("Keyboard Shortcuts", "app.show-help-overlay")
        self.menu.append("About Gali", "app.about")
        self.menu_button.set_icon_name("open-menu-symbolic")
        self.menu_button.set_menu_model(self.menu)
        self.pack_end(self.menu_button) 


class GaliApplicationWindow(Gtk.ApplicationWindow):
    """Main Gali window"""
    __gtype_name__ = "GaliApplicationWindow"

    box = None
    list_store = None
    list_selection_model = None
    list_factory = None
    list_view = None
    header_bar = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Window properties

        self.props.default_width = 600
        self.props.default_height = 300

        # Components
        
        self.box = Gtk.Box()
        self.label = Gtk.Label()
        self.list_store = Gio.ListStore.new(GameGObject)
        self.list_selection_model = Gtk.NoSelection()
        self.list_factory = Gtk.SignalListItemFactory()
        self.list_view = Gtk.ListView()
        self.header_bar = GaliHeaderBar()

        # Assembly

        self.label.set_label("Hello, World! (in python)")
        self.box.set_orientation(Gtk.Orientation.VERTICAL)
        self.box.append(self.label)
        self.list_selection_model.set_model(self.list_store)
        self.list_view.set_model(self.list_selection_model)
        self.list_view.set_factory(self.list_factory)
        # TODO bind factory signals to methods
        # https://toshiocp.github.io/Gtk4-tutorial/sec26.html#gtksignallistitemfactory
        self.box.append(self.list_view)
        self.set_child(self.box)
        self.set_titlebar(self.header_bar)


    def update_games_list_store(self, games: list[Game]):
        self.list_store.remove_all()
        n_games = len(games)
        items = list(map(lambda g: GameGObject(g), games))
        self.list_store.splice(0, 0, items)