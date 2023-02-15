from gali.sources.retroarch.abc_retroarch_startup_chain import ABCRetroarchStartupChain


class RetroarchNativeStartupChain(ABCRetroarchStartupChain):

    name = "Retroarch"
    stem = ["retroarch", "--libretro"]