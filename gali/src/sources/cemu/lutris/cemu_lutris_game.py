from gali.sources.cemu.lutris.abc_cemu_lutris_game import ABCCemuLutrisGame
from gali.sources.cemu.lutris.cemu_lutris_startup_chain import CemuLutrisStartupChain
from gali.sources.startable import Startable

class CemuLutrisGame(ABCCemuLutrisGame, Startable):
    """Class representing a Cemu in Lutris game"""

    startup_chains = [
        CemuLutrisStartupChain
    ]
