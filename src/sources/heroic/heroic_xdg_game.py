from gali.sources.startable import Startable
from gali.sources.heroic.heroic_game import HeroicGame
from gali.sources.heroic.heroic_xdg_startup_chain import HeroicXDGStartupChain


class HeroicXDGGame(HeroicGame, Startable):

    startup_chains = [
        HeroicXDGStartupChain
    ]
