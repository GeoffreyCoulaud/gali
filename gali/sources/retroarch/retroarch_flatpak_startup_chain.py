from gali.sources.retroarch.retroarch_startup_chain import RetroarchStartupChain


class RetroarchFlatpakStartupChain(RetroarchStartupChain):

    name = "Retroarch Flatpak"
    stem = ["flatpak", "run", "org.libretro.RetroArch", "--libretro"]