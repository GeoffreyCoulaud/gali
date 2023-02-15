from gali.sources.abc_startable import ABCStartable
from gali.sources.legendary.abc_legendary_game import ABCLegendaryGame
from gali.sources.legendary.legendary_native_startup_chain import LegendaryNativeStartupChain


class LegendaryNativeGame(ABCLegendaryGame, ABCStartable):

    startup_chains = [
        LegendaryNativeStartupChain
    ]