from gali.sources.abc_startable import ABCStartable
from gali.sources.legendary.abc_legendary_game import ABCLegendaryGame
from gali.sources.legendary.legendary_startup_chain import LegendaryStartupChain


class LegendaryGame(ABCLegendaryGame, ABCStartable):

    startup_chains = [
        LegendaryStartupChain
    ]