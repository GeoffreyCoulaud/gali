from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame


@dataclass
class ABCRetroarchGame(EmulationGame):

    core_path: str = field(default=None)