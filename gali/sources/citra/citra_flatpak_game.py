from gali.sources.abc_startable import ABCStartable
from gali.sources.citra.abc_citra_game import ABCCitraGame
from gali.sources.citra.citra_flatpak_startup_chain import CitraFlatpakStartupChain


class CitraFlatpakGame(ABCCitraGame, ABCStartable):

    startup_chains = [
        CitraFlatpakStartupChain
    ]