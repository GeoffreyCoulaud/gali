from dataclasses import dataclass, field

from gali.sources.emulation_game import EmulationGame
from gali.sources.retroarch.retroarch_startup_chain import RetroarchStartupChain


@dataclass
class RetroarchGame(EmulationGame):

    core_path: str = field(default=None)
    startup_chains = [
        RetroarchStartupChain
    ]