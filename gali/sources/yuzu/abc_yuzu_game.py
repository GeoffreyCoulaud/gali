from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class ABCYuzuGame(EmulationGame):

    platform: str = field(default="Nintendo - Switch", init=False)
