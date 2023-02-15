from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame


@dataclass
class ABCPPSSPPGame(ABCEmulationGame):

    platform: str = field(default="Sony - PSP", init=False)
