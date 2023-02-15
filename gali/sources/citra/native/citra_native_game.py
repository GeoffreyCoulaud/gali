from gali.sources.abc_startable import ABCStartable
from gali.sources.citra.abc_citra_game import ABCCitraGame
from gali.sources.citra.native.citra_native_startup_chain import CitraNativeStartupChain


class CitraNativeGame(ABCCitraGame, ABCStartable):

    startup_chains = [
        CitraNativeStartupChain
    ]