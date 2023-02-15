from gali.sources.dolphin.abc_dolphin_startup_chain import ABCDolphinStartupChain


class DolphinNativeStartupChain(ABCDolphinStartupChain):

    name = "Dolphin"
    stem = ["dolphin-emu"]