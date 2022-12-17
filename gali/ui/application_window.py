from gi.repository import Gtk, Adw
from gali.games.game import Game
from gali.ui.header_bar_controls import HeaderBarControls
from gali.ui.games_view import GamesView
from gali.ui.scan_view import ScanView


class ApplicationWindow(Gtk.ApplicationWindow):
    """Main Gali window"""
    __gtype_name__ = "GaliApplicationWindow"

    scan_view = None
    games_view = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # Window properties
        self.props.default_width = 600
        self.props.default_height = 300

        # Views
        self.scan_view = ScanView()
        self.games_view = GamesView()

        # View stack
        stack = Adw.ViewStack(vexpand=True)
        stack.add_titled_with_icon(self.scan_view, "scan_view", "Scan", "view-refresh-symbolic")
        stack.add_titled_with_icon(self.games_view, "games_view", "Games", "input-gaming-symbolic")

        # Header bar
        header_bar = Adw.HeaderBar()
        header_bar.pack_end(HeaderBarControls())
        self.set_titlebar(header_bar)

        # View stack switcher bar
        switcher = Adw.ViewSwitcherBar(stack=stack)
        switcher.set_reveal(True)

        # Box with view stack and stack switcher bar 
        box = Gtk.Box()
        box.set_orientation(Gtk.Orientation.VERTICAL)
        box.append(stack)
        box.append(switcher)
        self.set_child(box)

    def update_games(self, games: tuple[Game]):
        """
        Update the application's displayed games
        """
        self.games_view.update_games(games)