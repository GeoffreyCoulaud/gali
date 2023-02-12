from dataclasses import dataclass, field

from gali.sources.game import Game
from gali.sources.lutris.lutris_startup_chain import LutrisStartupChain

@dataclass
class LutrisGame(Game):

    platform: str = field(default="PC", init=False)
    game_slug: str = field(default=None)
    config_path: str = field(default=None)
    startup_chains = [
        LutrisStartupChain
    ]
