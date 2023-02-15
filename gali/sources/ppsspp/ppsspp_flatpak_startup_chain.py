from gali.sources.ppsspp.ppsspp_startup_chain import PPSSPPStartupChain
from gali.sources.ppsspp.abc_ppsspp_game import ABCPPSSPPGame


class PPSSPPFlatpakStartupChain(PPSSPPStartupChain):

    game: ABCPPSSPPGame
    name = "PPSSPP Flatpak"
    stem = ["flatpak", "run", "org.ppsspp.PPSSPP"]