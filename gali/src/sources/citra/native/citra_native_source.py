from gali.sources.citra.citra_source import CitraSource
from gali.sources.citra.native.citra_native_game import CitraNativeGame
from gali.utils.locations import HOME


class CitraNativeSource(CitraSource):

    name: str = "Citra"
    game_class: type[CitraNativeGame] = CitraNativeGame
    config_path: str = f"{HOME}/.config/citra-emu/qt-config.ini"