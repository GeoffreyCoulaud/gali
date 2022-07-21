from gi.repository import Gtk


@Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/blueprints/\
about_dialog.ui")
class AboutDialog(Gtk.AboutDialog):
    """Dialog for about Gali"""

    def __init__(self, parent):
        Gtk.AboutDialog.__init__(self)
        self.set_transient_for(parent)
