from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame


@dataclass
class ABCRetroarchGame(ABCEmulationGame):

    core_path: str = field(default=None)