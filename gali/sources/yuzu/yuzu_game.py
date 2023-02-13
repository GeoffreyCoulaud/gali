from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame
from gali.sources.yuzu.yuzu_startup_chain import YuzuStartupChain

@dataclass
class YuzuGame(EmulationGame):

    platform: str = field(default="Nintendo - Switch", init=False)
    startup_chains = [
        YuzuStartupChain
    ]
