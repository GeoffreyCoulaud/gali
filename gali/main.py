# main.py
#
# Copyright 2022 Geoffrey Coulaud
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import sys
import gi
gi.require_version("Gtk", "4.0")
gi.require_version("Adw", "1")
from gi.repository import Gtk, Gio, Adw  # noqa: F401,E402

from gali.ui.application_window import ApplicationWindow  # noqa: E402
from gali.ui.game_gobject import GameGObject
from gali.library import Library  # noqa: E402


class GaliApplication(Adw.Application):
    """The main application singleton class."""

    library = None
    games_list_store = None

    def __init__(self):
        super().__init__(
            application_id="com.github.geoffreycoulaud.gali",
            flags=Gio.ApplicationFlags.FLAGS_NONE
        )
        
        self.create_action("quit", self.quit, ["<primary>q"])
        self.create_action("scan", self.on_scan)
        self.create_action("print_library", self.on_print_library_action)
        self.create_action("about", self.on_about_action)
        self.create_action("preferences", self.on_preferences_action)

        self.games_list_store = Gio.ListStore.new(GameGObject)
        self.games_list_store.connect("notify::n-items", self.on_games_list_store_size_change)

        # TODO read user preferences
        enabled_source_names = [
            "Cemu (Lutris)",
            "Citra",
            "Citra (Flatpak)",
            "Dolphin",
            "Dolphin (Flatpak)",
            "PPSSPP",
            "PPSSPP (Flatpak)",
            "Yuzu",
            "Yuzu (Flatpak)",
            "Desktop Entries",
            "Heroic",
            "Heroic (Flatpak)",
            "Itch",
            "Legendary",
            "Lutris",
            "Steam",
            "Steam (Flatpak)",
            "Retroarch",
            "Retroarch (Flatpak)",
        ]
        self.library = Library(enabled_source_names)

    def do_activate(self):
        window = self.props.active_window
        if not window:
            window = ApplicationWindow(
                application=self,
                games_list_store=self.games_list_store
            )
        window.present()

    def on_scan(self, *data):
        """
        Handle scan signal
        """
        # TODO Scan in a different thread
        # TODO Display a scanning cancellable toast
        self.library.scan()
        items = list(map(lambda g: GameGObject(g), self.library.games))
        self.games_list_store.splice(0, self.games_list_store.get_n_items(), items)

    def on_games_list_store_size_change(self, *data):
        """
        Handle change of number of items in the games_list_storee
        """
        if self.games_list_store.get_n_items() == 0:
            self.props.active_window.set_active_view("no_games")
        else:
            self.props.active_window.set_active_view("games")

    def on_print_library_action(self, *data):
        self.library.print()

    def on_about_action(self, *data):
        about = Adw.AboutWindow()
        about.set_developers([
            "Geoffrey Coulaud",
        ])
        about.set_artists([
            "Marie Moua",
        ])
        about.set_documenters([
            # Add documentation contributors here
        ])
        about.set_translator_credits(
            "" # Add translators here
        )
        about.set_license_type(Gtk.License.GPL_3_0)
        about.set_website("https://github.com/GeoffreyCoulaud/gali")
        about.set_issue_url("https://github.com/GeoffreyCoulaud/gali/issues")
        about.set_support_url("https://github.com/GeoffreyCoulaud/gali/issues")
        about.set_transient_for(self.props.active_window)
        about.present()

    def on_preferences_action(self, *data):
        print("app.preferences action activated")

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


def main(version):
    app = GaliApplication()
    return app.run(sys.argv)
