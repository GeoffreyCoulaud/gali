from gali.sources.dolphin.dolphin_startup_chain import DolphinStartupChain
from gali.sources.dolphin.abc_dolphin_game import ABCDolphinGame


class DolphinFlatpakStartupChain(DolphinStartupChain):

    game: ABCDolphinGame
    name = "Dolphin Flatpak"
    stem = ["flatpak", "run", "org.DolphinEmu.dolphin-emu"]