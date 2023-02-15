from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class ABCCitraGame(EmulationGame):

    platform: str = field(default="Nintendo - 3DS", init=False)