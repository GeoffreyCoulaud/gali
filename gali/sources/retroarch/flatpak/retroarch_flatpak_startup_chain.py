from gali.sources.retroarch.abc_retroarch_startup_chain import ABCRetroarchStartupChain


class RetroarchFlatpakStartupChain(ABCRetroarchStartupChain):

    name = "Retroarch Flatpak"
    stem = ["flatpak", "run", "org.libretro.RetroArch", "--libretro"]