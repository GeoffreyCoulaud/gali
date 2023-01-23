from gi.repository import Gtk, Adw
from gali.games.game import Game
from gali.ui.header_bar_controls import HeaderBarControls
from gali.ui.games_view import GamesView

# @Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/main_window.ui")
class ApplicationWindow(Gtk.ApplicationWindow):
    """
    Main Gali window
    """

    games_view = None
    stack = None

    def __init__(self, application, games_list_store):
        super().__init__(application=application)

        # Window properties
        self.props.default_width = 600
        self.props.default_height = 600

        # Games view
        self.games_view = GamesView(games_list_store=games_list_store)
        
        # No games view
        button_content = Adw.ButtonContent()
        button_content.set_label("Scan sources")
        button_content.set_icon_name("system-search-symbolic")
        button = Gtk.Button()
        button.set_child(button_content)
        button.set_action_name("app.scan")
        clamp = Adw.Clamp()
        clamp.set_maximum_size(300)
        clamp.set_child(button)
        no_games_view = Adw.StatusPage()
        no_games_view.set_icon_name("system-search-symbolic")
        no_games_view.set_title("No games found")
        no_games_view.set_description("Maybe try a broader filter")
        no_games_view.set_child(clamp)

        # View stack
        self.stack = Gtk.Stack(vexpand=True)
        self.stack.set_transition_type(Gtk.StackTransitionType.CROSSFADE)
        self.stack.add_named(no_games_view, "no_games")
        self.stack.add_named(self.games_view, "games")

        # Header bar
        header_bar = Adw.HeaderBar()
        header_bar.pack_end(HeaderBarControls())
        self.set_titlebar(header_bar)

        # Box with view stack and stack switcher bar 
        box = Gtk.Box()
        box.set_orientation(Gtk.Orientation.VERTICAL)
        box.append(self.stack)
        self.set_child(box)

    def set_active_view(self, visible_child_name):
        """Change the active view"""
        self.stack.set_visible_child_name(visible_child_name)