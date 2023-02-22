from gali.sources.startable import Startable
from gali.sources.citra.citra_game import CitraGame
from gali.sources.citra.native.citra_native_startup_chain import CitraNativeStartupChain


class CitraNativeGame(CitraGame, Startable):

    startup_chains = [
        CitraNativeStartupChain
    ]