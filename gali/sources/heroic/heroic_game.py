from dataclasses import dataclass, field

from gali.sources.abc_generic_game import ABCGenericGame
from gali.sources.heroic.heroic_startup_chain import HeroicStartupChain


@dataclass
class HeroicGame(ABCGenericGame):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)
    startup_chains = [
        HeroicStartupChain
    ]
