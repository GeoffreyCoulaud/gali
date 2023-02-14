from typing import Sequence

from gali.sources.startup_chain import StartupChain
from gali.sources.game import Game


class Startable(Game):
    """Class representing a startable object"""

    startup_chains: Sequence[type[StartupChain]]