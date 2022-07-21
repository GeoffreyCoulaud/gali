from gi.repository import Gtk


@Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/blueprints/\
gali_application_window.ui")
class GaliApplicationWindow(Gtk.ApplicationWindow):
    """Main Gali window"""
    __gtype_name__ = "GaliApplicationWindow"

    label = Gtk.Template.Child()
