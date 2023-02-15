from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame


@dataclass
class ABCDolphinGame(ABCEmulationGame):

    platform: str = field(default="Nintendo - Gamecube / Wii", init=False)