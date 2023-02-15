from dataclasses import dataclass, field

from gali.sources.abc_generic_game import ABCGenericGame
from gali.sources.desktop.desktop_startup_chain import DesktopStartupChain


@dataclass
class DesktopGame(ABCGenericGame):

    platform: str = field(default="PC", init=False)
    is_installed: bool = field(default=True, init=False)
    exec_str: str = field(default=None)
    startup_chains = [
        DesktopStartupChain
    ]