from dataclasses import dataclass, field

from gali.sources.base_game import BaseGame
from gali.sources.heroic.heroic_startup_chain import HeroicStartupChain


@dataclass
class HeroicGame(BaseGame):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)
    startup_chains = [
        HeroicStartupChain
    ]
