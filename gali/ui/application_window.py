from gi.repository import Gtk, Adw
from gali.sources.all_sources import all_sources

# Must be processed by GTK first, needed in application_window.ui
from gali.ui.games_view import GaliGamesView

@Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/application_window.ui")
class GaliApplicationWindow(Adw.ApplicationWindow):
    __gtype_name__ = "GaliApplicationWindow"
    
    games_store = None

    view_stack = Gtk.Template.Child()
    games_view = Gtk.Template.Child()
    filter_popover = Gtk.Template.Child()

    def __init__(self, application=None, games_store=None):
        super().__init__(application=application)
        self.games_store = games_store
        self._init_games_view()
        self._init_filter_popover()

    def set_active_view(self, visible_child_name):
        """Change the active view in the stack.
        
        Available options are 
        - no_games
        - games
        """
        self.view_stack.set_visible_child_name(visible_child_name)

    def _init_games_view(self):
        selection_model = self.games_view.get_model()
        selection_model.set_model(self.games_store)

    def _init_filter_popover(self):
        box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        for klass in all_sources:
            check_button = Gtk.CheckButton.new_with_label(klass.name)
            if not klass().is_scannable():
                check_button.set_active(False)
            box.append(check_button)
        self.filter_popover.set_child(box)