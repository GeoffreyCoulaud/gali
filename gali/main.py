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
from gi.repository import Gtk, Gio, Adw, GObject  # noqa: F401,E402

from gali.ui.gali_application_window import GaliApplicationWindow  # noqa: E402
from gali.library import Library  # noqa: E402


class GaliApplication(Adw.Application):
    """The main application singleton class."""

    def __init__(self):
        super().__init__(
            application_id="com.github.geoffreycoulaud.gali",
            flags=Gio.ApplicationFlags.FLAGS_NONE
        )
        self.create_action("quit", self.quit, ["<primary>q"])
        self.create_action("scan", self.on_scan_action)
        self.create_action("print_library", self.on_print_library_action)
        self.create_action("about", self.on_about_action)
        self.create_action("preferences", self.on_preferences_action)

        # TODO read user preferences
        # TODO only enable scannable sources (having a config file or another precondition met)
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
        win = self.props.active_window
        if not win:
            win = GaliApplicationWindow(application=self)
        win.present()

    def on_scan_action(self, widget, _):
        self.library.scan()
        win = self.props.active_window
        if not win:
            print("No main window to render games")
            return
        # Update the list store of games
        win.update_games_list_store(self.library.games)

    def on_print_library_action(self, widget, _):
        self.library.print()

    def on_about_action(self, widget, _):
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

    def on_preferences_action(self, widget, _):
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
