from gali.sources.retroarch.retroarch_startup_chain import RetroarchStartupChain


class RetroarchNativeStartupChain(RetroarchStartupChain):

    name = "Retroarch"
    stem = ["retroarch", "--libretro"]