from dataclasses import dataclass, field

from gali.sources.game import Game
from gali.sources.heroic.heroic_startup_chain import HeroicStartupChain


@dataclass
class HeroicGame(Game):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)
    startup_chains = [
        HeroicStartupChain
    ]
