from dataclasses import dataclass, field

from gali.sources.abc_generic_game import ABCGenericGame
from gali.sources.legendary.legendary_startup_chain import LegendaryStartupChain


@dataclass
class LegendaryGame(ABCGenericGame):

    platform: str = field(default="PC", init=False)
    app_name: str = field(default=None)
    startup_chains = [
        LegendaryStartupChain
    ]