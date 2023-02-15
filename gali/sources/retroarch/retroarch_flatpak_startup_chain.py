from gali.sources.retroarch.abc_retroarch_game import ABCRetroarchGame
from gali.sources.retroarch.retroarch_startup_chain import RetroarchStartupChain


class RetroarchFlatpakStartupChain(RetroarchStartupChain):

    game: ABCRetroarchGame
    name = "Retroarch Flatpak"
    stem = ["flatpak", "run", "org.libretro.RetroArch", "--libretro"]