from gi.repository import Gtk

@Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/game_life_cycle_controls.ui")
class GaliGameLifeCycleControls(Gtk.Box):
    __gtype_name__ = "GaliGameLifeCycleControls"
    