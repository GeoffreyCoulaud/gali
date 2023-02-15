from dataclasses import dataclass, field

from gali.sources.abc_generic_game import ABCGenericGame
from gali.sources.lutris.lutris_startup_chain import LutrisStartupChain

@dataclass
class LutrisGame(ABCGenericGame):

    platform: str = field(default="PC", init=False)
    game_slug: str = field(default=None)
    config_path: str = field(default=None)
    startup_chains = [
        LutrisStartupChain
    ]
