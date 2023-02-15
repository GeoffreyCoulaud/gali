from gali.sources.abc_startable import ABCStartable
from gali.sources.desktop.abc_desktop_game import ABCDesktopGame
from gali.sources.desktop.desktop_startup_chain import DesktopStartupChain


class DesktopGame(ABCDesktopGame, ABCStartable):

    startup_chains = [
        DesktopStartupChain
    ]