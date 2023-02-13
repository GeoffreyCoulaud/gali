from dataclasses import dataclass, field

from gali.sources.game import Game
from gali.sources.legendary.legendary_startup_chain import LegendaryStartupChain


@dataclass
class LegendaryGame(Game):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)
    startup_chains = [
        LegendaryStartupChain
    ]