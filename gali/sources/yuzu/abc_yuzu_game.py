from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame


@dataclass
class ABCYuzuGame(ABCEmulationGame):

    platform: str = field(default="Nintendo - Switch", init=False)
