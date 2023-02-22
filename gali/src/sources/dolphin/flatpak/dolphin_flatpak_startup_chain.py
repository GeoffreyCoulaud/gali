from gali.sources.dolphin.dolphin_startup_chain import DolphinStartupChain


class DolphinFlatpakStartupChain(DolphinStartupChain):

    name = "Dolphin Flatpak"
    stem = ["flatpak", "run", "org.DolphinEmu.dolphin-emu"]