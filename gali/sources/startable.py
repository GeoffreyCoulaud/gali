from abc import ABC
from typing import Sequence

from gali.sources.startup_chain import StartupChain


class Startable(ABC):
    """Class representing a startable object"""

    startup_chains: Sequence[type[StartupChain]]