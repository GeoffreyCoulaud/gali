from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class DolphinGame(EmulationGame):

    platform: str = field(default="Nintendo - Gamecube / Wii", init=False)