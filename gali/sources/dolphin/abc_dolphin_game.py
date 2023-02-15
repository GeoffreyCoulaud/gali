from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class ABCDolphinGame(EmulationGame):

    platform: str = field(default="Nintendo - Gamecube / Wii", init=False)