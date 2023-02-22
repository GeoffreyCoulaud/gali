from gi.repository import Gtk, Adw
import gali.singletons as singletons

# Must be processed by GTK first, needed in application_window.ui
from gali.ui.games_view import GamesView
from gali.ui.games_details import GameDetails
from gali.ui.filter_popover import FilterPopover
from gali.ui.game_life_cycle_controls import GameLifeCycleControls


@Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/application_window.ui")
class ApplicationWindow(Adw.ApplicationWindow):
    __gtype_name__ = "GaliApplicationWindow"

    flap = Gtk.Template.Child("flap")
    view_stack = Gtk.Template.Child("view_stack")
    games_view = Gtk.Template.Child("games_view")
    game_details = Gtk.Template.Child("game_details")

    def __init__(self, application):
        super().__init__(application=application)
        singletons.library.gtk_selection_model.connect("selection-changed", self.on_selection_change)

    def set_active_view(self, visible_child_name):
        """Change the active view in the stack.
        
        Available options are 
        - no_games
        - games
        """
        self.view_stack.set_visible_child_name(visible_child_name)

    def on_selection_change(self, selection_model, *args):
        """Handle the selected game changing"""
        # Find selected game
        n_items = singletons.library.gio_list_store.get_n_items()
        selected_item = None
        for i in range(n_items):
            is_selected = singletons.library.gtk_selection_model.is_selected(i)
            if not is_selected: continue
            selected_item = singletons.library.gio_list_store.get_item(i)
            break
        
        # Hide flap is none selected
        if selected_item is None:
            self.flap.set_reveal_flap(False)
            return
        
        # Show flap with data
        self.flap.set_reveal_flap(True)
        self.game_details.set_game(selected_item.game)

        # Update launcher game
        singletons.launcher.set_game(selected_item.game)

    def on_game_before_start(self, *args):
        """Handle game about to start"""
        # TODO lock game selection
        # TODO flap grabs all clicks can't be closed
        print("Game starting")

    def on_game_stopped(self, *args):
        """Handle game stopped"""
        # TODO unlock game selection
        # TODO revert flap to normal
        print("Game closed")