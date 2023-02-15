from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame
from gali.sources.retroarch.native.retroarch_native_startup_chain import RetroarchNativeStartupChain


class RetroarchFlatpakStartupChain(RetroarchNativeStartupChain):

    game: ABCRetroarchGame
    name = "Retroarch Flatpak"
    stem = ["flatpak", "run", "org.libretro.RetroArch", "--libretro"]