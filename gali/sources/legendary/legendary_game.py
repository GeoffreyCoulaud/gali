from dataclasses import dataclass, field

from gali.sources.base_game import BaseGame
from gali.sources.legendary.legendary_startup_chain import LegendaryStartupChain


@dataclass
class LegendaryGame(BaseGame):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)
    startup_chains = [
        LegendaryStartupChain
    ]