from gali.sources.dolphin.dolphin_native_startup_chain import DolphinNativeStartupChain
from gali.sources.dolphin.abc_dolphin_game import ABCDolphinGame


class DolphinFlatpakStartupChain(DolphinNativeStartupChain):

    game: ABCDolphinGame
    name = "Dolphin Flatpak"
    stem = ["flatpak", "run", "org.DolphinEmu.dolphin-emu"]