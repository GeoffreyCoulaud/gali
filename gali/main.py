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

from gi.repository import Gtk, Gio, Adw

from gali.ui.window import GaliWindow, AboutDialog
from gali.library import Library

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
		TEMP_ENABLED_SOURCES = [
			"Cemu (Lutris)",
			# "Citra",
			# "Citra (Flatpak)", 
			# "Dolphin",
			# "Dolphin (Flatpak)",
			# "PPSSPP",
			# "PPSSPP (Flatpak)",
			# "Yuzu",
			# "Yuzu (Flatpak)",
			# "Desktop Entries",
			# "Heroic",
			# "Heroic (Flatpak)",
			# "Legendary",
			# "Lutris",
			# "Steam",
			# "Steam (Flatpak)",
			# "Retroarch",
			# "Retroarch (Flatpak)",
		]
		self.library = Library(TEMP_ENABLED_SOURCES)

	def do_activate(self):
		"""Called when the application is activated.

		We raise the application"s main window, creating it if
		necessary.
		"""
		win = self.props.active_window
		if not win:
			win = GaliWindow(application=self)
		win.present()

	def on_scan_action(self, widget, _):
		"""Callback for the app.scan action."""
		self.library.scan()

	def on_print_library_action(self, widget, _):
		"""Callback for the app.print_library action"""
		self.library.print()

	def on_about_action(self, widget, _):
		"""Callback for the app.about action."""
		about = AboutDialog(self.props.active_window)
		about.present()

	def on_preferences_action(self, widget, _):
		"""Callback for the app.preferences action."""
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
	"""The application"s entry point."""
	app = GaliApplication()
	return app.run(sys.argv)
