from gali.sources.startable import Startable
from gali.sources.citra.abc_citra_game import ABCCitraGame
from gali.sources.citra.native.citra_native_startup_chain import CitraNativeStartupChain


class CitraNativeGame(ABCCitraGame, Startable):

    startup_chains = [
        CitraNativeStartupChain
    ]