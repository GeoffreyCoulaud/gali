from dataclasses import dataclass, field

from gali.sources.base_game import BaseGame
from gali.sources.desktop.desktop_startup_chain import DesktopStartupChain


@dataclass
class DesktopGame(BaseGame):

    platform: str = field(default="PC", init=False)
    is_installed: bool = field(default=True, init=False)
    exec_str: str = field(default=None)
    startup_chains = [
        DesktopStartupChain
    ]