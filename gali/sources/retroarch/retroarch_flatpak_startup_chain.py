from gali.sources.retroarch.retroarch_startup_chain import RetroarchStartupChain


class RetroarchFlatpakStartupChain(RetroarchStartupChain):

    stem = ["flatpak", "run", "org.libretro.RetroArch", "--libretro"]