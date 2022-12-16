from gi.repository import Gtk, Gio


class HeaderBarControls(Gtk.Box):

    menu_button = None
    menu = None

    def __init__(self, **kwargs):
        super().__init__(**kwargs)

        self.menu_button = Gtk.MenuButton()
        self.menu = Gio.Menu()
        
        self.menu.append("Scan Library", "app.scan")
        self.menu.append("Print Library", "app.print_library")
        self.menu.append("Preferences", "app.preferences")
        self.menu.append("Keyboard Shortcuts", "app.show-help-overlay")
        self.menu.append("About Gali", "app.about")
        self.menu_button.set_icon_name("open-menu-symbolic")
        self.menu_button.set_menu_model(self.menu)
        self.append(self.menu_button)