from gi.repository import Gtk, Adw


class ScanView(Gtk.ScrolledWindow):

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        # TODO Proper scan view
        # Tickable sources (greyed unscannables)
        # Scan button
        # Progress spinner
        label = Gtk.Label()
        label.set_label("Scan view")
        self.set_child(label)
