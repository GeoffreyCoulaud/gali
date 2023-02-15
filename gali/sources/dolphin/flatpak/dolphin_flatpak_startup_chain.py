from gali.sources.dolphin.abc_dolphin_startup_chain import ABCDolphinStartupChain


class DolphinFlatpakStartupChain(ABCDolphinStartupChain):

    name = "Dolphin Flatpak"
    stem = ["flatpak", "run", "org.DolphinEmu.dolphin-emu"]