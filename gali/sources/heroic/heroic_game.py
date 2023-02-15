from gali.sources.abc_startable import ABCStartable
from gali.sources.heroic.abc_heroic_game import ABCHeroicGame
from gali.sources.heroic.heroic_startup_chain import HeroicStartupChain


class HeroicGame(ABCHeroicGame, ABCStartable):

    startup_chains = [
        HeroicStartupChain
    ]
