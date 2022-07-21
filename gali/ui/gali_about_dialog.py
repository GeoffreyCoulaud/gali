from gi.repository import Gtk


@Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/blueprints/\
gali_about_dialog.ui")
class GaliAboutDialog(Gtk.AboutDialog):
    """Dialog for about Gali"""
    __gtype_name__ = "GaliAboutDialog"

    def __init__(self, parent):
        Gtk.AboutDialog.__init__(self)
        self.set_authors([
            "Geoffrey Coulaud",
        ])
        self.set_artists([
            "Marie Moua",
        ])
        self.set_transient_for(parent)
