from gali.sources.startable import Startable
from gali.sources.citra.abc_citra_game import ABCCitraGame
from gali.sources.citra.flatpak.citra_flatpak_startup_chain import CitraFlatpakStartupChain


class CitraFlatpakGame(ABCCitraGame, Startable):

    startup_chains = [
        CitraFlatpakStartupChain
    ]