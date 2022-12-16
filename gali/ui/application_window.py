from gi.repository import Gtk, Adw
from gali.games.game import Game
from gali.ui.games_view_window import GamesViewWindow
from gali.ui.header_bar_controls import HeaderBarControls


class ApplicationWindow(Gtk.ApplicationWindow):
    """Main Gali window"""
    __gtype_name__ = "GaliApplicationWindow"

    games_view_window = None
    header_bar = None
    header_bar_controls = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Window properties
        self.props.default_width = 600
        self.props.default_height = 300

        # Components
        self.games_view_window = GamesViewWindow()
        self.set_child(self.games_view_window)

        # Header bar
        self.header_bar = Adw.HeaderBar()
        self.header_bar_controls = HeaderBarControls()
        self.header_bar.pack_end(self.header_bar_controls)
        self.set_titlebar(self.header_bar)


    def update_games(self, games: tuple[Game]):
        """
        Update the application's displayed games
        """
        self.games_view_window.update_games(games)