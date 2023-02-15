from dataclasses import dataclass, field

from gali.sources.abc_emulation_game import ABCEmulationGame
from gali.sources.retroarch.retroarch_startup_chain import RetroarchStartupChain


@dataclass
class RetroarchGame(ABCEmulationGame):

    core_path: str = field(default=None)
    startup_chains = [
        RetroarchStartupChain
    ]