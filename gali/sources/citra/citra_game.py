from gali.sources.abc_startable import ABCStartable
from gali.sources.citra.abc_citra_game import ABCCitraGame
from gali.sources.citra.citra_startup_chain import CitraStartupChain


class CitraGame(ABCCitraGame, ABCStartable):

    startup_chains = [
        CitraStartupChain
    ]