import gi
gi.require_version("Gtk", "4.0")
gi.require_version("Adw", "1")
from gi.repository import Gtk, Gio, Adw  # noqa: F401,E402

from gali.ui.application_window import ApplicationWindow  # noqa: E402
import gali.singletons as singletons

class Application(Adw.Application):
    """The main application singleton class."""

    games_store = None

    def __init__(self):
        super().__init__(
            application_id="com.github.geoffreycoulaud.gali",
            flags=Gio.ApplicationFlags.FLAGS_NONE,
        )
        singletons.library.gio_list_store.connect("notify::n-items", self.on_library_size_change)
        self.create_action("quit", self.quit, ["<primary>q"])
        self.create_action("scan", self.on_scan)
        self.create_action("about", self.on_about)
        self.create_action("preferences", self.on_preferences)
        self.create_action("start-game-requested", self.on_start_game_requested)
        self.create_action("stop-game-requested", self.on_stop_game_requested)
        self.create_action("kill-game-requested", self.on_kill_game_requested)

    def do_activate(self):
        window = self.props.active_window
        if not window: window = ApplicationWindow(application=self)
        window.present()

    def on_scan(self, *data):
        # TODO Display a scanning cancellable toast
        singletons.library.scan()

    def on_about(self, *data):
        builder = Gtk.Builder.new_from_resource(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/about_window.ui")
        about_window = builder.get_object("about_window")
        about_window.set_transient_for(self.props.active_window)
        about_window.present()
    
    def on_preferences(self, *data):
        print("Preferences action")

    def on_library_size_change(self, *data):
        """
        Handle change of number of items in the library
        """
        n_items = singletons.library.gio_list_store.get_n_items()
        window = self.props.active_window
        if n_items == 0: window.set_active_view("no_games_view")
        else: window.set_active_view("games_view")

    def on_start_game_requested(self, *data):
        singletons.launcher.start()

    def on_stop_game_requested(self, *data):
        singletons.launcher.stop()

    def on_kill_game_requested(self, *data):
        builder = Gtk.Builder.new_from_resource(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/kill_game_confirm_dialog.ui")
        dialog = builder.get_object("kill_game_confirm_dialog")
        dialog.connect("response", self.on_kill_game_confirm_response)
        dialog.set_transient_for(self.props.active_window)
        dialog.present()

    def on_kill_game_confirm_response(self, response: str, *data):
        if response == "kill":
            singletons.launcher.kill()

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
