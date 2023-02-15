from gali.sources.cemu.abc_cemu_lutris_game import ABCCemuLutrisGame
from gali.sources.cemu.cemu_lutris_startup_chain import CemuLutrisStartupChain
from gali.sources.abc_startable import ABCStartable

class CemuLutrisGame(ABCCemuLutrisGame, ABCStartable):
    """Class representing a Cemu in Lutris game"""

    startup_chains = [
        CemuLutrisStartupChain
    ]
