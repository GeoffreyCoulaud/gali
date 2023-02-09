from gi.repository import Gtk
import gali.singletons as singletons

class GaliGamesViewFactory():
    """Utility class to create a SignalListItemFactory used to display games"""

    def create_factory() -> Gtk.SignalListItemFactory:
        """Create a new SignalListItemFactory connected to this class' signal handlers"""
        factory = Gtk.SignalListItemFactory()
        factory.connect("setup", GaliGamesViewFactory.on_setup)
        factory.connect("bind", GaliGamesViewFactory.on_bind)
        factory.connect("unbind", GaliGamesViewFactory.on_unbind)
        factory.connect("teardown", GaliGamesViewFactory.on_teardown)
        return factory

    def on_setup(widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the setup signal
        In charge of creating the inner structure of the ListItem widget.
        """
        label = Gtk.Label()
        list_item.set_child(label)

    def on_bind(widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the bind signal
        In charge of finalizing the widget's content and signals just before
        it is presented (at creation or reuse)
        """
        label = list_item.get_child()
        game_gobject = list_item.get_item()
        label.set_label(str(game_gobject))

    def on_unbind(widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the unbind signal
        In charge of undoing the bind step. It is called before bind at reuse
        and before teardown at destroy time.
        """
        # Nothing to do here
        pass

    def on_teardown(widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the teardown signal
        In charge of undoing the setup step. Used to free the inner structure
        to set the widgets' reference count to 0.
        """
        list_item.set_child(None)

class GaliGamesView(Gtk.ListView):
    __gtype_name__ = "GaliGamesView"

    def __init__(self):
        super().__init__()
        self.set_model(singletons.library.gtk_selection_model)
        factory = GaliGamesViewFactory.create_factory()
        self.set_factory(factory)

    def test(self, *args):
        print("factory should do its job")