from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame
from gali.sources.yuzu.yuzu_startup_chain import YuzuStartupChain

@dataclass
class YuzuGame(ABCEmulationGame):

    platform: str = field(default="Nintendo - Switch", init=False)
    startup_chains = [
        YuzuStartupChain
    ]
