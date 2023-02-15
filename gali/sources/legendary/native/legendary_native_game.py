from gali.sources.startable import Startable
from gali.sources.legendary.abc_legendary_game import ABCLegendaryGame
from gali.sources.legendary.native.legendary_native_startup_chain import LegendaryNativeStartupChain


class LegendaryNativeGame(ABCLegendaryGame, Startable):

    startup_chains = [
        LegendaryNativeStartupChain
    ]