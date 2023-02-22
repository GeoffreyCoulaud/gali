from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class PPSSPPGame(EmulationGame):

    platform: str = field(default="Sony - PSP", init=False)
