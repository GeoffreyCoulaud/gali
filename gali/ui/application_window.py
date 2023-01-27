from gi.repository import Gtk, Adw
from gali.sources.all_sources import all_sources

# Must be processed by GTK first, needed in application_window.ui
from gali.ui.games_view import GaliGamesView

@Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/application_window.ui")
class GaliApplicationWindow(Adw.ApplicationWindow):
    __gtype_name__ = "GaliApplicationWindow"

    view_stack = Gtk.Template.Child()
    games_view = Gtk.Template.Child()
    filter_popover = Gtk.Template.Child()

    def __init__(self, application):
        super().__init__(application=application)
        self._init_filter_popover()

    def set_active_view(self, visible_child_name):
        """Change the active view in the stack.
        
        Available options are 
        - no_games
        - games
        """
        self.view_stack.set_visible_child_name(visible_child_name)

    def _init_filter_popover(self):
        box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        for klass in all_sources:
            if not klass().is_scannable():
                continue
            check_button = Gtk.CheckButton.new_with_label(klass.name)
            check_button.set_active(True)
            box.append(check_button)
        self.filter_popover.set_child(box)