from gali.sources.dolphin.dolphin_startup_chain import DolphinStartupChain


class DolphinFlatpakStartupChain(DolphinStartupChain):

    stem = ["flatpak", "run", "org.DolphinEmu.dolphin-emu"]