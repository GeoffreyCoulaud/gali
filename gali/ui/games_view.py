from gi.repository import Adw, Gtk, Gio


@Gtk.Template(resource_path="/com/github/geoffreycoulaud/gali/ui/templates/games_view.ui")
class GaliGamesView(Gtk.ListView):
    __gtype_name__ = "GaliGamesView"

    games_store = None
    selection_model = Gtk.Template.Child()

    def __init__(self):
        super().__init__()

    def set_games_store(self, games_store):
        self.games_store = games_store
        self.selection_model.set_model(self.games_store)

    def get_games_store(self):
        return self.games_store

    @Gtk.Template.Callback()
    def on_setup(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the setup signal
        In charge of creating the inner structure of the ListItem widget.
        """
        label = Gtk.Label()
        list_item.set_child(label)

    @Gtk.Template.Callback()
    def on_bind(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the bind signal
        In charge of finalizing the widget's content and signals just before
        it is presented (at creation or reuse)
        """
        label = list_item.get_child()
        game_gobject = list_item.get_item()
        label.set_label(str(game_gobject))

    @Gtk.Template.Callback()
    def on_unbind(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the unbind signal
        In charge of undoing the bind step. It is called before bind at reuse
        and before teardown at destroy time.
        """
        # Nothing to do here
        pass

    @Gtk.Template.Callback()
    def on_teardown(self, widget: Gtk.ListView, list_item: Gtk.ListItem):
        """
        Callback for the teardown signal
        In charge of undoing the setup step. Used to free the inner structure
        to set the widgets' reference count to 0.
        """
        label = list_item.set_child(None)