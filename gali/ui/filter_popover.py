from gi.repository import Gtk
from gali.sources.source import Source
from gali.sources.all_sources import all_sources
import gali.singletons as singletons

class GaliFilterPopover(Gtk.Popover):
    """A class representing the games filtering Popover"""

    __gtype_name__ = "GaliFilterPopover"

    button_source_map: dict[Gtk.CheckButton, type[Source]] = dict()

    def __init__(self) -> None:
        super().__init__()
        box = Gtk.Box(orientation=Gtk.Orientation.VERTICAL)
        for klass in all_sources:
            if not klass().is_scannable(): continue
            button = Gtk.CheckButton.new_with_label(klass.name)
            self.button_source_map[button] = klass
            button.set_active(True)
            button.connect("toggled", self.on_check_toggled)
            box.append(button)
        self.set_child(box)

    def on_check_toggled(self, button: Gtk.CheckButton):
        """Update the visibility a source when its filter button changes state"""
        if button not in self.button_source_map.keys():
            raise Exception("Unknown filter button toggled")
        klass = self.button_source_map[button]
        if button.get_active():
            singletons.library.show_source(klass)
        else:
            singletons.library.hide_source(klass)