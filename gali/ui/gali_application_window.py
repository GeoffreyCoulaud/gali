from gi.repository import Adw, Gtk, Gio, GObject
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


class StringListItemFactory(Gtk.SignalListItemFactory):
    """
    A factory in charge of a ListView's ListItem creation, use, reuse and destruction.
    The created ListItems only contain a Label with the string representation of
    the item they are wrapping.
    """

    __gtype_name__ = "StringListItemFactory"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.connect("setup", self.handle_setup)
        self.connect("bind", self.handle_bind)
        self.connect("unbind", self.handle_unbind)
        self.connect("teardown", self.handle_teardown)

    def handle_setup(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the setup signal
        In charge of creating the inner structure of the ListItem widget.
        """
        label = Gtk.Label()
        list_item.set_child(label)
    
    def handle_bind(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the bind signal
        In charge of finalizing the widget's content and signals just before
        it is presented (at creation or reuse)
        """
        label = list_item.get_child()
        game_gobject = list_item.get_item()
        label.set_label(str(game_gobject))
    
    def handle_unbind(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the unbind signal
        In charge of undoing the bind step. It is called before bind at reuse
        and before teardown at destroy time.
        """
        # Nothing to do here
        pass
    
    def handle_teardown(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the teardown signal
        In charge of undoing the setup step. Used to free the inner structure
        to set the widgets' reference count to 0.
        """
        label = list_item.set_child(None)


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

    scrolled_window = None
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
        
        self.scrolled_window = Gtk.ScrolledWindow()
        self.list_store = Gio.ListStore.new(GameGObject)
        self.list_selection_model = Gtk.NoSelection()
        self.list_factory = StringListItemFactory()
        self.list_view = Gtk.ListView()
        self.header_bar = GaliHeaderBar()

        # Assembly

        self.list_selection_model.set_model(self.list_store)
        self.list_view.set_model(self.list_selection_model)
        self.list_view.set_factory(self.list_factory)
        self.scrolled_window.set_child(self.list_view)
        self.set_child(self.scrolled_window)
        self.set_titlebar(self.header_bar)


    def update_games_list_store(self, games: list[Game]):
        """
        Update the application's game list with the passed games.
        """
        items = list(map(lambda g: GameGObject(g), games))
        self.list_store.splice(0, self.list_store.get_n_items(), items)