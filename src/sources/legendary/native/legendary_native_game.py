from gali.sources.startable import Startable
from gali.sources.legendary.legendary_game import LegendaryGame
from gali.sources.legendary.native.legendary_native_startup_chain import LegendaryNativeStartupChain


class LegendaryNativeGame(LegendaryGame, Startable):

    startup_chains = [
        LegendaryNativeStartupChain
    ]