from gi.repository import Gtk


class StringListItemFactory(Gtk.SignalListItemFactory):
    """
    A factory in charge of a ListView's ListItem creation, use, reuse and destruction.
    The created ListItems only contain a Label with the string representation of
    the item they are wrapping.
    """

    __gtype_name__ = "StringListItemFactory"

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.connect("setup", self.handle_setup)
        self.connect("bind", self.handle_bind)
        self.connect("unbind", self.handle_unbind)
        self.connect("teardown", self.handle_teardown)

    def handle_setup(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the setup signal
        In charge of creating the inner structure of the ListItem widget.
        """
        label = Gtk.Label()
        list_item.set_child(label)
    
    def handle_bind(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the bind signal
        In charge of finalizing the widget's content and signals just before
        it is presented (at creation or reuse)
        """
        label = list_item.get_child()
        game_gobject = list_item.get_item()
        label.set_label(str(game_gobject))
    
    def handle_unbind(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the unbind signal
        In charge of undoing the bind step. It is called before bind at reuse
        and before teardown at destroy time.
        """
        # Nothing to do here
        pass
    
    def handle_teardown(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the teardown signal
        In charge of undoing the setup step. Used to free the inner structure
        to set the widgets' reference count to 0.
        """
        label = list_item.set_child(None)