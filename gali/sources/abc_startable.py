from abc import ABC
from typing import Sequence

from gali.sources.abc_startup_chain import ABCStartupChain


class ABCStartable(ABC):
    """Class representing a startable object"""

    startup_chains: Sequence[type[ABCStartupChain]]