from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class ABCPPSSPPGame(EmulationGame):

    platform: str = field(default="Sony - PSP", init=False)
