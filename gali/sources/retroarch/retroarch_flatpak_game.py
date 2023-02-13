from dataclasses import dataclass

from gali.sources.retroarch.retroarch_game import RetroarchGame
from gali.sources.retroarch.retroarch_flatpak_startup_chain import RetroarchFlatpakStartupChain

@dataclass
class RetroarchFlatpakGame(RetroarchGame):

    startup_chains = [
        RetroarchFlatpakStartupChain
    ]