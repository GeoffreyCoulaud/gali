from gali.sources.startable import Startable
from gali.sources.desktop.abc_desktop_game import ABCDesktopGame
from gali.sources.desktop.desktop_startup_chain import DesktopStartupChain


class DesktopGame(ABCDesktopGame, Startable):

    startup_chains = [
        DesktopStartupChain
    ]