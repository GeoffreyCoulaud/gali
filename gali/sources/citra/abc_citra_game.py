from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame


@dataclass
class ABCCitraGame(ABCEmulationGame):

    platform: str = field(default="Nintendo - 3DS", init=False)