import gi
gi.require_version("Gtk", "4.0")
gi.require_version("Adw", "1")
from gi.repository import Gtk, Gio, Adw  # noqa: F401,E402

from gali.ui.application_window import GaliApplicationWindow  # noqa: E402
from gali.ui.game_gobject import GameGObject
from gali.library import Library  # noqa: E402

class GaliApplication(Adw.Application):
    """The main application singleton class."""

    library = None
    games_store = None

    def __init__(self, library: Library = None):
        super().__init__(
            application_id="com.github.geoffreycoulaud.gali",
            flags=Gio.ApplicationFlags.FLAGS_NONE,
        )
        self.library = library
        self.games_store = Gio.ListStore(item_type=GameGObject)
        self.games_store.connect("notify::n-items", self.on_games_list_store_size_change)
        self.create_action("quit", self.quit, ["<primary>q"])
        self.create_action("scan", self.on_scan)
        self.create_action("about", self.on_about)
        self.create_action("preferences", self.on_preferences)

    def do_activate(self):
        window = self.props.active_window
        if not window: 
            window = GaliApplicationWindow(application=self, games_store=self.games_store)
        window.present()

    def on_scan(self, *data):
        # TODO Scan in a different thread
        # TODO Display a scanning cancellable toast
        self.library.scan()
        items = list(map(lambda g: GameGObject(g), self.library.games))
        self.games_store.splice(0, self.games_store.get_n_items(), items)

    def on_about(self, *data):
        builder = Gtk.Builder.new_from_resource(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/about_window.ui")
        about_window = builder.get_object("about_window")
        about_window.set_transient_for(self.props.active_window)
        about_window.present()
    
    def on_preferences(self, *data):
        print("Preferences action")

    def on_games_list_store_size_change(self, *data):
        """
        Handle change of number of items in the games_list_storee
        """
        if self.games_store.get_n_items() == 0:
            self.props.active_window.set_active_view("no_games_view")
        else:
            self.props.active_window.set_active_view("games_view")

    def create_action(self, name, callback, shortcuts=None):
        """Add an application action.

        Args:
            name: the name of the action
            callback: the function to be called when the action is activated
            shortcuts: an optional list of accelerators
        """
        action = Gio.SimpleAction.new(name, None)
        action.connect("activate", callback)
        self.add_action(action)
        if shortcuts:
            self.set_accels_for_action(f"app.{name}", shortcuts)
