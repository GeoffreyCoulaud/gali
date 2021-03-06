# window.py
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

from gi.repository import Gtk


@Gtk.Template(
    resource_path="/com/github/geoffreycoulaud/gali/templates/window.ui"
)
class GaliWindow(Gtk.ApplicationWindow):
    """Main Gali window"""
    __gtype_name__ = "GaliWindow"

    label = Gtk.Template.Child()


class AboutDialog(Gtk.AboutDialog):
    """Dialog for about Gali"""

    def __init__(self, parent):
        Gtk.AboutDialog.__init__(self)
        self.props.program_name = "gali"
        self.props.version = "0.1.0"
        self.props.authors = ["Geoffrey Coulaud"]
        self.props.copyright = "2022 Geoffrey Coulaud"
        self.props.logo_icon_name = "com.github.geoffreycoulaud.gali"
        self.props.modal = True
        self.set_transient_for(parent)
