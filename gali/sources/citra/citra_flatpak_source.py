from gali.sources.citra.citra_native_source import CitraNativeSource
from gali.sources.citra.citra_flatpak_game import CitraFlatpakGame
from gali.utils.locations import HOME

class CitraFlatpakSource(CitraNativeSource):

    name: str = "Citra (Flatpak)"
    game_class: type[CitraFlatpakGame] = CitraFlatpakGame
    config_path: str = f"{HOME}/.var/app/org.citra_emu.citra/config/citra-emu/qt-config.ini"
