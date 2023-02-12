from abc import ABC, abstractmethod
from typing import Iterable

from gali.sources.startup_chain import StartupChain


class Startable(ABC):
    """Class representing a startable object"""

    startup_chains: Iterable[StartupChain]