from gali.sources.startable import Startable
from gali.sources.heroic.abc_heroic_game import ABCHeroicGame
from gali.sources.heroic.heroic_startup_chain import HeroicStartupChain


class HeroicGame(ABCHeroicGame, Startable):

    startup_chains = [
        HeroicStartupChain
    ]
